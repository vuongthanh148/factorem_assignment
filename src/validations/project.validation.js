import Joi from 'joi';
import { ROLE_ENUM } from '../shared/config/roles.js';
import { password } from './custom.validation.js';

const createProject = {
  body: Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required().custom(password),
    role: Joi.string().required().valid(ROLE_ENUM.CUSTOMER, ROLE_ENUM.ADMIN, ROLE_ENUM.SUPPLIER),
  }),
};

const getProjects = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

export default {
  createProject,
  getProjects,
};
