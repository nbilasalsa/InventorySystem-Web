// File: src/middleware/validation.middleware.js (KODE PERBAIKAN ESM)

export default (schema) => (req, res, next) => {
  const result = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
  if (result.error) {
    const errors = result.error.details.map(d => ({ message: d.message, path: d.path }));
    return res.status(400).json({ success:false, message:'Validation error', errors });
  }
  req.body = result.value;
  next();
};