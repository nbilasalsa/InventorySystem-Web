import Joi from 'joi';

export const createCategorySchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
});

export const updateCategorySchema = Joi.object({
  name: Joi.string().min(3).max(50).optional(),
});

// middleware validator
export function validateCategory(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(d => d.message),
      });
    }
    next();
  };
}