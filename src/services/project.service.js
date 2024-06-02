/* eslint-disable no-magic-numbers */
import { getManager, getRepository } from 'typeorm';
import Item from '../entity/item.entity.js';
import Project from '../entity/project.entity.js';
import { STATUS_LIST } from '../shared/constants/app.constant.js';
import { CustomError } from '../utils/custom-error.js';


/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
async function createProject(projectBody, items, user) {
  const entityManager = getManager();
  let savedProject, savedItems = [];
  try {
    await entityManager.transaction(async transactionalEntityManager => {
      const project = transactionalEntityManager.create(Project, { ...projectBody, customer: user });
      savedProject = await transactionalEntityManager.save(Project, project);
      for (let itemData of items) {
        const item = transactionalEntityManager.create(Item, { ...itemData, project: savedProject });
        const { project, ...savedItem } = await transactionalEntityManager.save(Item, item);
        savedItems.push(savedItem);
      }
    });
    return { ...savedProject, items: savedItems };
  } catch (error) {
    throw error;
  }
}

async function getProjectsByCustomer(userId) {
  const projectRepository = getRepository(Project);
  try {
    const projects = await projectRepository.createQueryBuilder("project")
      .select(["project", "customer.id", 'customer.username', "customer.role"])
      .leftJoin("project.customer", "customer")
      .leftJoinAndSelect("project.items", "item")
      .leftJoinAndSelect("item.quotations", "quotation", "quotation.status IN (:...statuses)", { statuses: [STATUS_LIST.APPROVED, STATUS_LIST.ACCEPTED] })
      .where("project.customer.id = :userId", { userId })
      .getMany();
    return projects;
  } catch (error) {
    throw error;
  }
}

async function getProjectsBySupplier(userId) {
  const projectRepository = getRepository(Project);
  try {
    const projects = await projectRepository.createQueryBuilder("project")
      .select(["project", "customer.id", 'customer.username', "customer.role"])
      .leftJoin("project.customer", "customer")
      .leftJoinAndSelect("project.items", "item", "item.status = :itemStatus", { itemStatus: STATUS_LIST.APPROVED })
      .leftJoinAndSelect("item.quotations", "quotation", "quotation.supplier = :userId", { userId })
      .where({ status: STATUS_LIST.APPROVED })
      .getMany();
    return projects;
  } catch (error) {
    throw error;
  }
}

async function getAllProjectsByAdmin() {
  const projectRepository = getRepository(Project);
  try {
    const projects = await projectRepository.createQueryBuilder("project")
      .select(["project", "customer.id", 'customer.username', "customer.role"])
      .leftJoin("project.customer", "customer")
      .leftJoinAndSelect("project.items", "item")
      .leftJoinAndSelect("item.quotations", "quotation")
      .getMany();
    return projects;
  } catch (error) {
    throw error;
  }
}

async function getProjectById(projectId, userId) {
  const projectRepository = getRepository(Project);
  try {
    const projects = await projectRepository.createQueryBuilder("project")
      .select(["project", "customer.id", 'customer.username', "customer.role"])
      .leftJoin("project.customer", "customer")
      .leftJoinAndSelect("project.items", "item")
      .leftJoinAndSelect("item.quotations", "quotation", "quotation.status = :status", { status: STATUS_LIST.APPROVED })
      .where("project.customer.id = :userId", { userId })
      .andWhere("project.id = :projectId", { projectId })
      .getMany();
    return projects;
  } catch (error) {
    throw error;
  }
}

async function getProjectByAdmin(projectId) {
  const projectRepository = getRepository(Project);
  try {
    const projects = await projectRepository.findOne({
      where: { id: projectId },
      relations: ["items", "items.quotations"]
    });
    return projects;
  } catch (error) {
    throw error;
  }
}

async function updateProjectStatus(projectId, newStatus) {
  const projectRepository = getRepository(Project);

  try {
    const project = await projectRepository.findOne({ where: { id: projectId, status: STATUS_LIST.PENDING }, relations: ["items"] });
    if (!project) {
      throw new CustomError({ code: '400001', message: "No pending project found" });
    }
    if (STATUS_LIST[newStatus] === undefined) throw new CustomError({ code: '400001', message: 'Invalid status.' })

    if (newStatus === STATUS_LIST.APPROVED) {
      const hasApprovedItem = project.items.some(item => item.status === STATUS_LIST.APPROVED);
      if (!hasApprovedItem) {
        throw new CustomError({ code: '400001', message: 'At least one item must be approved.' });
      }
    }

    project.status = newStatus;
    projectRepository.save(project);
    return project;

  } catch (error) {
    throw error;
  }
}

export default {
  createProject,
  getProjectsByCustomer,
  getProjectsBySupplier,
  getAllProjectsByAdmin,
  updateProjectStatus,
  getProjectById,
  getProjectByAdmin
};
