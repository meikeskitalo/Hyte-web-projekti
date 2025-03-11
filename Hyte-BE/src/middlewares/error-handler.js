import { validationResult } from 'express-validator';

/**
 * Virheen luontifunktio
 * @param {string} message - virheviesti
 * @param {number} status - HTTP-statuskoodi
 * @returns virheobjekti
 */
const customError = (message, status) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

/**
 * Middleware, joka käsittelee 404 Not Found -virheet
 * @api {middleware} notFoundHandler Handle 404 Not Found errors
 * @apiName NotFoundHandler
 * @apiGroup Middleware
 *
 * @apiError NotFoundError The requested resource was not found.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "Not Found - /requested-url"
 *     }
 * 
 * @param {object} req - pyyntöobjekti
 * @param {object} res - vastausobjekti
 * @param {function} next - next-funktio
 */
const notFoundHandler = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.status = 404;
  next(error); // välittää virheen virheenkäsittelijälle
};

/**
 * Oletus middleware virheiden käsittelyyn
 * @api {middleware} errorHandler Default error handler
 * @apiName ErrorHandler
 * @apiGroup Middleware
 *
 * @apiError InternalServerError An unexpected error occurred.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "An unexpected error occurred",
 *       "status": 500
 *     }
 * 
 * @param {object} err - virheobjekti
 * @param {object} req - pyyntöobjekti
 * @param {object} res - vastausobjekti
 * @param {function} next - next-funktio
 */
const errorHandler = (err, req, res, next) => {
  res.status(err.status || 500); // oletus on 500, jos err.status ei ole määritelty
  res.json({
    message: err.message,
    status: err.status || 500,
    errors: err.errors,
  });
};

/**
 * Middleware validointivirheiden käsittelyyn ja muotoiluun
 * @api {middleware} validationErrorHandler Handle validation errors
 * @apiName ValidationErrorHandler
 * @apiGroup Middleware
 *
 * @apiError ValidationError Validation failed.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "message": "Validation failed",
 *       "errors": [
 *         {
 *           "field": "username",
 *           "message": "Username is required"
 *         }
 *       ]
 *     }
 * 
 * @param {object} req - pyyntöobjekti
 * @param {object} res - vastausobjekti
 * @param {function} next - next-funktio
 * @return {*} next-funktion kutsu
 */
const validationErrorHandler = (req, res, next) => {
  const errors = validationResult(req, { strictParams: ['body'] });
  if (!errors.isEmpty()) {
    // console.log('validation errors', errors.array({onlyFirstError: true}));
    const error = new Error('Bad Request');
    error.status = 400;
    error.errors = errors.array({ onlyFirstError: true }).map((error) => {
      return { field: error.path, message: error.msg };
    });
    return next(error);
  }
  next();
};

export { notFoundHandler, errorHandler, validationErrorHandler, customError };