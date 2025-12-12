import Joi from 'joi';

export const registerSchema = Joi.object({
  role: Joi.string().valid('USER', 'ADMIN').default('USER').optional(),
  username: Joi.string().min(3).required(),
  password: Joi.string().min(6).required(),
  email: Joi.string().email().required(),
  name: Joi.string().required()
});

export const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
});
