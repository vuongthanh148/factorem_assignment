/* eslint-disable no-magic-numbers */
import { getManager, getRepository } from 'typeorm';
import Item from '../entity/item.entity.js';
import Project from '../entity/project.entity.js';
import User from '../entity/user.entity.js';
import { STATUS_LIST } from '../shared/constants/app.constant.js';
import { CustomError } from '../utils/custom-error.js';


/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
async function createProject(projectBody, items, user) {
  const entityManager = getManager();
  let savedProject, listItem = []
  try {
    await entityManager.transaction(async transactionalEntityManager => {
      const project = transactionalEntityManager.create(Project, { ...projectBody, user: user });
      savedProject = await transactionalEntityManager.save(Project, project);
      for (let itemData of items) {
        const item = transactionalEntityManager.create(Item, { ...itemData, project: savedProject });
        await transactionalEntityManager.save(Item, item);
        listItem.push(item);
      }
    });
    return { ...savedProject, items }
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

async function updateProjectStatus(projectId, newStatus) {
  const entityManager = getManager();
  const projectRepository = getRepository(Project);
  const itemRepository = getRepository(Item);

  try {
    const project = await projectRepository.findOne({ where: { id: projectId, status: STATUS_LIST.PENDING }, relations: ["items"] });
    if (!project) {
      throw new CustomError({ code: '400001', message: "No pending project found" });
    }

    project.status = newStatus;
    project.items.forEach(item => {
      if (item.status === STATUS_LIST.REJECTED) throw new CustomError({ code: '400001', message: 'Invalid item status.' })
      item.status = newStatus
    });

    await entityManager.transaction(async transactionalEntityManager => {
      // await itemRepository.save(project.items);
      await transactionalEntityManager.save(Item, project.items)
      const approvedProject = await transactionalEntityManager.save(Project, project);

      return approvedProject;
    });
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
  createProject,
  getProjectsByUserId,
  getAllProjects,
  updateProjectStatus
};
