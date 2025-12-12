// File: src/middleware/error.middleware.js (KODE PERBAIKAN ESM)

function errorHandler(err, req, res, next) {
  console.error(err);

  const status = err.status || 500;
  const response = {
    success: false,
    message: status === 500 ? 'Internal Server Error' : err.message,
    errors: err.errors || undefined,
  };

  if (process.env.NODE_ENV !== 'production' && err.stack) {
    response.stack = err.stack;
  }

  res.status(status).json(response);
}

export default errorHandler;