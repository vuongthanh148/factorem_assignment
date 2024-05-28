import bcrypt from 'bcrypt';
import { getRepository } from 'typeorm';
import User from '../entity/user.entity.js';
import { ErrorCode, ErrorMessage } from '../shared/constants/error.constant.js';
import { CustomError } from '../utils/custom-error.js';

const isPasswordMatch = function (password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * Login with username and password
 * @param {string} username
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithUsernameAndPassword = async (username, password) => {
  const userRepository = getRepository(User);
  const user = await userRepository.findOne({ where: { username } });
  if (!user || !(isPasswordMatch(password, user.password))) {
    throw new CustomError({ code: ErrorCode.LOGIN_FAILED, message: ErrorMessage.LOGIN_FAILED });
  }
  return user;
};

export default {
  loginUserWithUsernameAndPassword,
};
