/* eslint-disable no-magic-numbers */
import bcrypt from 'bcrypt';
import { getRepository } from 'typeorm';
import User from '../entity/user.entity.js';
import { DEFAULT_BCRYPT_SALT } from '../shared/constants/app.constant.js';
import { ErrorCode, ErrorMessage } from '../shared/constants/error.constant.js';
import { CustomError } from '../utils/custom-error.js';

const isUsernameTaken = async (username, excludeUserId = null) => {
  const userRepository = getRepository(User);
  const query = userRepository.createQueryBuilder('user')
    .where('user.username = :username', { username });

  if (excludeUserId) {
    query.andWhere('user.id != :excludeUserId', { excludeUserId });
  }

  const user = await query.getOne();
  return Boolean(user);
};

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  const userRepository = getRepository(User);
  if (await isUsernameTaken(userBody.username)) {
    throw new CustomError({ code: ErrorCode.USER_NAME_EXIST, message: ErrorMessage.USER_NAME_EXIST });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(userBody.password, DEFAULT_BCRYPT_SALT);
  userBody.password = hashedPassword;
  // Create new user
  const user = userRepository.create(userBody);

  // Save user to database
  await userRepository.save(user);

  return user
};

/**
 * @typedef {Object} Option
 * @property {string} sortBy - Sort option in the format: sortField:(desc|asc)
 * @property {number} limit - Maximum number of results per page (default = 10)
 * @property {number} page - Current page (default = 1)
 */
/**
 * Query for users
 * @param {Object} filter - TypeORM filter
 * @param {Option} options - Query options
 * @returns {Promise<[User[], number]>}
 */
const queryUsers = async (filter, options) => {
  const userRepository = getRepository(User);

  const [users, total] = await userRepository.findAndCount({
    where: filter,
    order: options.sortBy ? {
      [options.sortBy.split(':')[0]]: options.sortBy.split(':')[1].toUpperCase(),
    } : {},
    skip: (options.page - 1) * options.limit,
    take: options.limit,
  });

  return {
    data: users,
    total,
    page: options.page,
    totalPages: Math.ceil(total / options.limit),
  };
};

/**
 * Get user by username
 * @param {string} username
 * @returns {Promise<User>}
 */
const getUserByUsername = async (username) => {
  const userRepository = getRepository(User);
  return userRepository.findOne({ username });
};

export default {
  createUser,
  queryUsers,
  getUserByUsername,
  isUsernameTaken
};
