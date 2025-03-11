import express from 'express';
import { getMe, login } from '../controllers/auth-controller.js';
import { authenticateToken } from '../middlewares/authentication.js';

const authRouter = express.Router();

/**
 * @apiDefine all No authentication needed.
 */

/**
 * @apiDefine token Logged in user access only
 * Valid authentication token must be provided within request.
 */

/**
 * @api {post} /api/auth/login User login
 * @apiName PostLogin
 * @apiGroup Authentication
 * @apiPermission all
 *
 * @apiBody {String} username Username
 * @apiBody {String} password User's password
 * @apiParamExample {json} Request-Example:
 *  {
 *    "username": "myusername",
 *    "password": "mypassword"
 *  }
 *
 * @apiSuccess {String} message Result of the request
 * @apiSuccess {Object} user User details
 * @apiSuccess {Number} user.user_id User id
 * @apiSuccess {String} user.username Username
 * @apiSuccess {String} user.email Email address
 * @apiSuccess {String} user.created_at Registration date
 * @apiSuccess {String} user.user_level User's user level
 * @apiSuccess {String} token Authentication token
 */
authRouter.post('/login', login);

/**
 * @api {get} /auth/me Request information about current user
 * @apiName GetMe
 * @apiGroup Authentication
 * @apiPermission token
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiSuccess {Object} user User info.
 * @apiSuccess {Number} user.user_id Id of the User.
 * @apiSuccess {String} user.username Username of the User.
 * @apiSuccess {String} user.email email of the User.
 * @apiSuccess {Number} user.user_level_id User level id of the User.
 * @apiSuccess {Number} user.iat Token creation timestamp.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "user_id": 21,
 *       "username": "johnd",
 *       "email": "johnd@example.com",
 *       "user_level_id": 2,
 *       "iat": 1701279021
 *     }
 *
 * @apiError InvalidToken Authentication token was invalid.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 403 Forbidden
 *     {
 *       "message": "invalid token"
 *     }
 */
authRouter.get('/me/', authenticateToken, getMe);

export default authRouter;