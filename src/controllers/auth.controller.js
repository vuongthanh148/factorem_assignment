import httpStatus from 'http-status';
import { authService, tokenService, userService } from '../services/index.service.js';
import { asyncHandler } from '../utils/async-handler.js';

const register = asyncHandler(async (req, res) => {
  const user = await userService.createUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({ user, tokens });
});

const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const user = await authService.loginUserWithUsernameAndPassword(username, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

const refreshToken = asyncHandler(async (req, res) => {
  const refreshToken = req.body.refreshToken;
  const tokens = await tokenService.refreshAuthTokens(refreshToken);
  res.send({ tokens });
});

const getUserInfo = asyncHandler(async (req, res) => {
  const user = req.user;
  res.send({ user });
});

export default { register, login, getUserInfo, refreshToken };
