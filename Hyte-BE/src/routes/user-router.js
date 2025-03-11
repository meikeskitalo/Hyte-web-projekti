import express from 'express';
import { body } from 'express-validator';
import {
  addUser,
  deleteUser,
  editUser,
  getUserById,
  getUsers,
  editUserByUserId
} from '../controllers/user-controller.js';
import { authenticateToken } from '../middlewares/authentication.js';
import { validationErrorHandler } from '../middlewares/error-handler.js';

const userRouter = express.Router();

/**
 * @apiDefine token Logged in user access only
 * Valid authentication token must be provided within request.
 */

/**
 * @api {get} /api/users Get all users
 * @apiName GetUsers
 * @apiGroup Users
 * @apiPermission token
 *
 * @apiHeader {String} Authorization Bearer token.
 * 
 * @apiSuccess {Object[]} users List of users
 * 
 * @apiError UnauthorizedError Authentication token was invalid.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "message": "invalid token"
 *     }
 */
userRouter
  .route('/')
  .get(authenticateToken, getUsers)
  /**
   * @api {post} /api/users Add a new user
   * @apiName AddUser
   * @apiGroup Users
   * @apiPermission token
   *
   * @apiHeader {String} Authorization Bearer token.
   * 
   * @apiBody {String} username Username
   * @apiBody {String} password Password
   * @apiBody {String} email Email
   * 
   * @apiSuccess {String} message Result of the request
   * 
   * @apiError ValidationError Validation failed
   * @apiErrorExample Error-Response:
   *     HTTP/1.1 400 Bad Request
   *     {
   *       "message": "Validation failed",
   *       "errors": [...]
   *     }
   */
  .post(
    body('username').trim().isLength({ min: 3, max: 20 }).isAlphanumeric(),
    body('password').trim().isLength({ min: 8, max: 120 }),
    body('email').trim().isEmail(),
    validationErrorHandler,
    addUser,
  )
  /**
   * @api {put} /api/users Update user by ID
   * @apiName EditUserByUserId
   * @apiGroup Users
   * @apiPermission token
   *
   * @apiHeader {String} Authorization Bearer token.
   * 
   * @apiBody {String} username Username
   * @apiBody {String} password Password
   * @apiBody {String} email Email
   * 
   * @apiSuccess {String} message Result of the request
   * 
   * @apiError ValidationError Validation failed
   * @apiErrorExample Error-Response:
   *     HTTP/1.1 400 Bad Request
   *     {
   *       "message": "Validation failed",
   *       "errors": [...]
   *     }
   */
  .put(
    body('username').trim().isLength({ min: 3, max: 20 }).isAlphanumeric(),
    body('password').trim().isLength({ min: 8, max: 120 }),
    body('email').trim().isEmail(),
    validationErrorHandler,
    authenticateToken,
    editUserByUserId);

/**
 * @api {get} /api/users/:id Get user by ID
 * @apiName GetUserById
 * @apiGroup Users
 * @apiPermission token
 *
 * @apiHeader {String} Authorization Bearer token.
 * 
 * @apiParam {Number} id User ID
 * 
 * @apiSuccess {Object} user User details
 * 
 * @apiError NotFoundError User not found
 * @apiErrorExample Error-Response:
   *     HTTP/1.1 404 Not Found
   *     {
   *       "message": "User not found"
   *     }
 */
userRouter.route('/:id')
  .get(validationErrorHandler, authenticateToken, getUserById)
  /**
   * @api {put} /api/users/:id Update user by ID
   * @apiName EditUser
   * @apiGroup Users
   * @apiPermission token
   *
   * @apiHeader {String} Authorization Bearer token.
   * 
   * @apiParam {Number} id User ID
   * 
   * @apiBody {String} username Username
   * @apiBody {String} password Password
   * @apiBody {String} email Email
   * 
   * @apiSuccess {String} message Result of the request
   * 
   * @apiError NotFoundError User not found
   * @apiErrorExample Error-Response:
   *     HTTP/1.1 404 Not Found
   *     {
   *       "message": "User not found"
   *     }
   */
  .put(editUser)
  /**
   * @api {delete} /api/users/:id Delete user by ID
   * @apiName DeleteUser
   * @apiGroup Users
   * @apiPermission token
   *
   * @apiHeader {String} Authorization Bearer token.
   * 
   * @apiParam {Number} id User ID
   * 
   * @apiSuccess {String} message Result of the request
   * 
   * @apiError NotFoundError User not found
   * @apiErrorExample Error-Response:
   *     HTTP/1.1 404 Not Found
   *     {
   *       "message": "User not found"
   *     }
   */
  .delete(validationErrorHandler, authenticateToken, deleteUser);

export default userRouter;