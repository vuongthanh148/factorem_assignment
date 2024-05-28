import Joi from 'joi';
import { ROLE_ENUM } from '../shared/config/roles.js';
import { password } from './custom.validation.js';

const register = {
  body: Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required().custom(password),
    role: Joi.string().valid(...Object.values(ROLE_ENUM)).default(ROLE_ENUM.CUSTOMER),
  }),
};

const login = {
  body: Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

export default {
  register,
  login,
};
