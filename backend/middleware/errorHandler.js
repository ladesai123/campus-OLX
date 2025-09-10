export const errorHandler = (err, req, res, next) => {
  console.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Default error response
  let error = {
    message: 'Internal server error',
    status: 500
  };

  // Handle specific error types
  if (err.name === 'ValidationError') {
    error = {
      message: 'Validation error',
      details: err.details || err.message,
      status: 400
    };
  } else if (err.name === 'JsonWebTokenError') {
    error = {
      message: 'Invalid token',
      status: 401
    };
  } else if (err.name === 'TokenExpiredError') {
    error = {
      message: 'Token expired',
      status: 401
    };
  } else if (err.code === 'LIMIT_FILE_SIZE') {
    error = {
      message: 'File too large',
      status: 400
    };
  } else if (err.code === '23505') { // PostgreSQL unique violation
    error = {
      message: 'Resource already exists',
      status: 409
    };
  } else if (err.code === '23503') { // PostgreSQL foreign key violation
    error = {
      message: 'Referenced resource not found',
      status: 400
    };
  } else if (err.message) {
    error.message = err.message;
    error.status = err.status || 500;
  }

  // Don't expose sensitive information in production
  if (process.env.NODE_ENV === 'production') {
    delete error.stack;
    if (error.status === 500) {
      error.message = 'Internal server error';
    }
  } else {
    error.stack = err.stack;
  }

  res.status(error.status).json({ error: error.message, ...error });
};