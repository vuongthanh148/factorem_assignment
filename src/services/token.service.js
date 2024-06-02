import jsonwebtoken from 'jsonwebtoken';
import moment from 'moment';
import { getRepository } from 'typeorm';
import Token from '../entity/token.entity.js';
import User from '../entity/user.entity.js';
import { GlobalConfig } from '../shared/config/globalConfig.js';
import { TOKEN_TYPE } from '../shared/constants/app.constant.js';

/**
 * Generate token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
const generateToken = (userId, role, expires, type, secret = GlobalConfig.jwt.secret) => {
  const payload = {
    sub: userId,
    role: role,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jsonwebtoken.sign(payload, secret);
};

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {string} type
 * @returns {Promise<Token>}
 */
const verifyToken = async (token, type) => {
  const tokenRepository = getRepository(Token);
  const payload = jsonwebtoken.verify(token, GlobalConfig.jwt.secret);
  const tokenDoc = await tokenRepository.findOne({ where: { token: token, type: payload.type, userId: payload.sub } });
  if (!tokenDoc) {
    throw new Error('Token not found');
  }
  return tokenDoc;
};

/**
 * Save a token
 * @param {string} token
 * @param {ObjectId} userId
 * @param {moment} expires
 * @param {string} type
 * @param {boolean} [blacklisted]
 * @returns {Promise<Token>}
 */
const saveToken = async (token, userId, expires, type, blacklisted = false) => {
  const tokenRepository = getRepository(Token);

  // Create new token
  const tokenDoc = tokenRepository.create({
    token,
    userId,
    expires,
    type,
  });

  // Save token to database
  await tokenRepository.save(tokenDoc);
  return tokenDoc;
};

/**
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise<Object>}
 */
const generateAuthTokens = async (user) => {
  const accessTokenExpires = moment().add(GlobalConfig.jwt.accessExpirationMinutes, 'minutes');
  const accessToken = generateToken(user.id, user.role, accessTokenExpires, TOKEN_TYPE.ACCESS);

  const refreshTokenExpires = moment().add(GlobalConfig.jwt.refreshExpirationDays, 'days');
  const refreshToken = generateToken(user.id, user.role, refreshTokenExpires, TOKEN_TYPE.REFRESH);
  await saveToken(refreshToken, user.id, refreshTokenExpires.toDate(), TOKEN_TYPE.REFRESH);

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};


/**
 * Refresh authentication tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuthTokens = async (refreshToken) => {
  const userRepository = getRepository(User);
  const tokenDoc = await verifyToken(refreshToken, TOKEN_TYPE.REFRESH);
  console.log({ tokenDoc })
  const user = await userRepository.findOne({ where: { id: tokenDoc.userId } });
  if (!user) {
    throw new Error('User not found');
  }
  const accessTokenExpires = moment().add(GlobalConfig.jwt.accessExpirationMinutes, 'minutes');
  const accessToken = generateToken(user.id, user.role, accessTokenExpires, TOKEN_TYPE.ACCESS);
  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
  };
};


export default {
  generateAuthTokens,
  generateToken,
  verifyToken,
  refreshAuthTokens,
};
