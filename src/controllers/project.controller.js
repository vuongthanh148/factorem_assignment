import httpStatus from 'http-status';
import projectService from '../services/project.service.js';
import { asyncHandler } from '../utils/async-handler.js';

const createProjectByCustomer = asyncHandler(async (req, res) => {
  const { projectName, items } = req.body;
  const createdProject = await projectService.createProject({ name: projectName }, items, req.user);
  res.status(httpStatus.CREATED).json(createdProject);
});

const getProjectsByCustomer = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const projects = await projectService.getProjectsByCustomer(userId);
  res.status(httpStatus.OK).json(projects);
});

const getProjectById = asyncHandler(async (req, res) => {
  const projectId = req.params.id;
  const userId = req.user.id;
  const project = await projectService.getProjectById(projectId, userId);
  res.status(httpStatus.OK).json(project);
});

const getAllProjectsByAdmin = asyncHandler(async (req, res) => {
  const projects = await projectService.getAllProjectsByAdmin();
  res.status(httpStatus.OK).json(projects);
});

const updateProjectStatus = asyncHandler(async (req, res) => {
  const projectId = req.params.id;
  const { status } = req.body
  const updatedProject = await projectService.updateProjectStatus(projectId, status);
  res.status(httpStatus.OK).json(updatedProject);
});


export default {
  createProjectByCustomer,
  getProjectsByCustomer,
  getAllProjectsByAdmin,
  updateProjectStatus,
  getProjectById
};
