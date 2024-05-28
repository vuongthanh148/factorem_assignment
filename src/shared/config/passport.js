import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import { getRepository } from 'typeorm';
import User from '../../entity/user.entity.js';
import { TOKEN_TYPE } from '../constants/app.constant.js';
import { GlobalConfig } from './globalConfig.js';

const jwtOptions = {
  secretOrKey: GlobalConfig.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};


const jwtVerify = async (payload, done) => {
  try {
    if (payload.type !== TOKEN_TYPE.ACCESS) {
      throw new Error('Invalid token type');
    }
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({ where: { id: payload.sub } });
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

export const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);
