import Joi from 'joi';

const createProject = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    items: Joi.array().items(
      Joi.object().keys({
        name: Joi.string().required(),
        price: Joi.number().required(),
        quantity: Joi.number().integer().required(),
      })
    ),

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
