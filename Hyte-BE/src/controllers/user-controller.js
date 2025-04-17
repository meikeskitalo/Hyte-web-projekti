import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import {
  insertUser,
  selectAllUsers,
  selectUserById,
  modifyUserByUserId,
  deleteUserByUserId,
} from '../models/user-model.js';
import { customError } from '../middlewares/error-handler.js';

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
const getUsers = async (req, res, next) => {
  if (req.user.user_level != "admin") {
    return next(customError("Not an admin", 500));
  }
  const users = await selectAllUsers();
  res.json(users);
};

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
const getUserById = async (req, res, next) => {
  if (req.user.user_level != "admin") {
    return next(customError("Not an admin", 500));
  }
  console.log('getUserById', req.params.id);

  try {
    const user = await selectUserById(req.params.id);
    console.log('User found:', user);
    // jos user löytyi, eli arvo ei ole undefined, lähetetään se vastauksena
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};

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
const addUser = async (req, res, next) => {
  console.log('addUser request body', req.body);
  // esitellään 3 uutta muuttujaa, johon sijoitetaan req.body:n vastaavien propertyjen arvot
  const { username, password, email } = req.body;
  // luodaan selväkielisestä sanasta tiiviste, joka tallennetaan kantaan
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  // luodaan uusi käyttäjä olio ja lisätään se tietokantaa käyttäen modelia
  const newUser = {
    username,
    password: hashedPassword,
    email,
  };
  try {
    const result = await insertUser(newUser);
    res.status(201);
    return res.json({ message: 'User added. id: ' + result });
  } catch (error) {
    return next(customError(error.message, 400));
  }
};

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
const editUser = (req, res) => {
  console.log('editUser request body', req.body);
  const user = users.find((user) => user.id == req.user.user_id);
  if (user) {
    user.username = req.body.username;
    user.password = req.body.password;
    user.email = req.body.email;
    res.json({ message: 'User updated.' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

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
const editUserByUserId = async (req, res, next) => {
  const userId = req.user.user_id;
  const { username, password, email } = req.body;
  if (username && password && email) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const updatedUser = {
      username,
      password: hashedPassword,
      email,
    };

    try {
      console.log('editUserByUserId', userId, updatedUser);
      const result = await modifyUserByUserId(userId, updatedUser);
      return res.status(200).json({ message: 'User updated: ' + result });
    } catch (error) {
      return next(customError(error.message, 500));
    }
  }
};

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
const deleteUser = async (req, res, next) => {
  if (req.user.user_level != "admin") {
    return next(customError("Not an admin", 500));
  }

  const userId = req.params.id;
  console.log('deleteUser', req.params.id);
  try {
    const result = await deleteUserByUserId(userId);
    return res.status(200).json({ message: 'User deleted: ' + result });
  } catch (error) {
    return next(customError(error.message, 500));
  }
};

export { getUsers, getUserById, addUser, editUser, deleteUser, editUserByUserId };
