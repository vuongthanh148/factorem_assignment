import httpStatus from 'http-status';
import projectService from '../services/project.service.js';
import { asyncHandler } from '../utils/async-handler.js';

const createProject = asyncHandler(async (req, res) => {
  const { projectName, items } = req.body;
  const createdProject = await projectService.createProject({ name: projectName }, items, req.user);
  res.status(httpStatus.CREATED).json(createdProject);
});

const getProjectsByUserId = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const projects = await projectService.getProjectsByUserId(userId);
  res.status(httpStatus.OK).json(projects);
});

const getAllProjects = asyncHandler(async (req, res) => {
  const projects = await projectService.getAllProjects();
  res.status(httpStatus.OK).json(projects);
});

const updateProjectStatus = asyncHandler(async (req, res) => {
  const projectId = req.params.id;
  const { status } = req.body
  const updatedProject = await projectService.updateProjectStatus(projectId, status);
  res.status(httpStatus.OK).json(updatedProject);
});


// const getAllProject = asyncHandler(async (req, res) => {
//   const { projectName, items } = req.body;
//   const createdProject = await projectService.getProjectByUserId({ name: projectName }, items, req.user);
//   res.status(httpStatus.CREATED).json(createdProject);
// });

// const queryGames = asyncHandler(async (req, res) => {
//   const name = req.query.name || undefined;
//   const filter = pick(req.query, ['category', 'platform', 'genre']);
//   const queryOption = pick(req.query, ['sortBy', 'limit', 'page']);

//   const searchCondition = {
//     name: new RegExp(name, 'i'),
//   };
//   const filterCondition = Object.keys(filter).reduce((filterObject, key) => {
//     filterObject[key] = {};
//     filterObject[key].$in = filter[key];
//     return filterObject;
//   }, {});

//   const result = await gameService.queryGames(
//     {
//       ...searchCondition,
//       ...filterCondition,
//     },
//     queryOption,
//   );

//   res.status(httpStatus.OK).send({ result });
// });

// const queryOneGame = asyncHandler(async (req, res) => {
//   const game = await gameService.getGameById(req.params.gameId);
//   res.status(httpStatus.OK).send({ game });
// });

// const updateGame = asyncHandler(async (req, res) => {
//   const updatedGame = await gameService.updateGame(req.params.gameId, req.body);
//   res.status(httpStatus.OK).send({ updatedGame });
// });

// const deleteGame = asyncHandler(async (req, res) => {
//   const deletedGame = await gameService.deleteGame(req.params.gameId);
//   res.status(httpStatus.OK).send({ deletedGame });
// });

export default {
  createProject,
  getProjectsByUserId,
  getAllProjects,
  updateProjectStatus
  // queryGames,
  // queryOneGame,
  // updateGame,
  // deleteGame,
};
