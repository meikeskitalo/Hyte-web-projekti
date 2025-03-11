import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { selectUserByUsername } from '../models/user-model.js';
import { customError } from '../middlewares/error-handler.js';

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
 *
 * @apiError ValidationError Validation failed
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "message": "Validation failed",
 *       "errors": [...]
 *     }
 * @apiError UnauthorizedError Authentication failed
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "message": "Bad username/password."
 *     }
 */
const login = async (req, res, next) => {
  const { username, password } = req.body;
  if (!username) {
    return next(customError('Username missing.', 400));
    //return res.status(401).json({message: 'Username missing.'});
  }
  const user = await selectUserByUsername(username);
  // jos käyttäjä löytyi tietokannasta verrataan kirjautumiseen syötettyä sanaa tietokannan
  // salasanatiivisteeseen
  if (user) {
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      // ennen tokenin generointia ja
      // käyttäjätietojen lähettämistä vastauksessa,
      // poistetaan salasana niistä
      delete user.password;
      const token = jwt.sign(user, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });

      return res.json({ message: 'login ok', user, token });
    }
  }
  //res.status(401).json({message: 'Bad username/password.'});
  next(customError('Bad username/password.', 401));
};

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
const getMe = (req, res) => {
  const user = req.user;
  res.json(user);
};

export { login, getMe };