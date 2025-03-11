import jwt from 'jsonwebtoken';
import 'dotenv/config';

/**
 * @apiDefine token Logged in user access only
 * Valid authentication token must be provided within request.
 */

/**
 * Middleware, joka autentikoi käyttäjän JWT-tokenin avulla
 * @api {middleware} authenticateToken Authenticate user using JWT token
 * @apiName AuthenticateToken
 * @apiGroup Middleware
 * @apiPermission token
 *
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiError UnauthorizedError Authentication token was missing or invalid.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "message": "No token provided"
 *     }
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 403 Forbidden
 *     {
 *       "message": "Invalid token"
 *     }
 * 
 * @param {object} req - pyyntöobjekti
 * @param {object} res - vastausobjekti
 * @param {function} next - next-funktio
 */
const authenticateToken = (req, res, next) => {
  console.log('authenticateToken', req.headers);
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  console.log('token', token);
  if (token == undefined) {
    // Jos token puuttuu, palautetaan 401 Unauthorized
    return res.sendStatus(401);
  }
  try {
    // Varmistetaan tokenin oikeellisuus ja lisätään käyttäjätiedot pyyntöön
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    // Jos token on virheellinen, asetetaan status 403 Forbidden ja välitetään virhe
    error.status = 403;
    next(error);
  }
};

export { authenticateToken };