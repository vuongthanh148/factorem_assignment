import { asyncHandler } from '../utils/async-handler.js';

const createProject = asyncHandler(async (req, res) => {
  // const createdGame = await gameService.createGame(req.body);
  // res.status(httpStatus.CREATED).send({ games: createdGame });
  res.status(200)
});

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
  createProject
  // createGame,
  // queryGames,
  // queryOneGame,
  // updateGame,
  // deleteGame,
};
