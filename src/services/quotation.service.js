/* eslint-disable no-magic-numbers */
import { getRepository } from 'typeorm';
import Item from '../entity/item.entity.js';
import Project from '../entity/project.entity.js';
import Quotation from '../entity/quotation.entity.js';
import User from '../entity/user.entity.js';
import { STATUS_LIST } from '../shared/constants/app.constant.js';
import { ErrorCode, ErrorMessage } from '../shared/constants/error.constant.js';
import { CustomError } from '../utils/custom-error.js';


async function createQuotation(itemId, quotationBody) {
  const quotationRepository = getRepository(Quotation);
  const itemRepository = getRepository(Item);

  try {
    const item = await itemRepository.findOne({ where: { id: itemId, status: STATUS_LIST.APPROVED } });
    if (!item) {
      throw new CustomError({ code: ErrorCode.ITEM_NOT_FOUND, message: ErrorMessage.ITEM_NOT_FOUND });
    }

    const createdQuotation = await quotationRepository.save({ ...quotationBody, item });

    return createdQuotation;
  } catch (error) {
    throw error;
  }
}

async function approveQuotation(quotationId) {
  const quotationRepository = getRepository(Quotation);

  try {
    const quotation = await quotationRepository.findOne({
      where: {
        id: quotationId,
        item: { status: STATUS_LIST.APPROVED }
      },
      relations: ["item"]
    });

    if (!quotation) {
      throw new CustomError({ code: '400004', message: 'Quotation not found!' });
    }

    if (quotation.status == STATUS_LIST.APPROVED) {
      throw new CustomError({ code: '400004', message: 'Quotation already approved!', data: quotation });
    }
    quotation.status = STATUS_LIST.APPROVED;
    const approvedQuotation = await quotationRepository.save(quotation);

    return approvedQuotation;
  } catch (error) {
    throw error;
  }
}

async function getProjectsByUserId(userId) {
  const projectRepository = getRepository(Project);
  try {
    const projects = await projectRepository.find({
      where: { "user.id": userId },
      relations: ["items"]
    });
    return projects;
  } catch (error) {
    throw error;
  }
}

async function getAllProjects() {
  const projectRepository = getRepository(Project);
  try {
    const projects = await projectRepository.find();
    return projects;
  } catch (error) {
    throw error;
  }
}


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
  createQuotation,
  approveQuotation
};
