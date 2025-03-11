import express from 'express';
import { getEntries, postEntry, updateEntryById, deleteEntryById } from '../controllers/entry-controller.js';
import { authenticateToken } from '../middlewares/authentication.js';
import { body, param } from 'express-validator';
import { validationErrorHandler } from '../middlewares/error-handler.js';

const entryRouter = express.Router();

/**
 * @apiDefine token Logged in user access only
 * Valid authentication token must be provided within request.
 */

/**
 * @api {post} /api/entries Add a new entry
 * @apiName PostEntry
 * @apiGroup Entries
 * @apiPermission token
 *
 * @apiHeader {String} Authorization Bearer token.
 * 
 * @apiBody {String} entry_date Entry date
 * @apiBody {String} mood Mood
 * @apiBody {Number} weight Weight
 * @apiBody {Number} sleep_hours Sleep hours
 * @apiBody {String} notes Notes
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
entryRouter
  .route('/')
  .post(
    // Varmista, että käyttäjä on kirjautunut
    authenticateToken,
    // Validoi merkinnän päivämäärä: ei saa olla tyhjä ja täytyy olla kelvollinen päivämäärä
    body('entry_date').notEmpty().isDate(),
    // Validoi mieliala: ei saa olla tyhjä, vähintään 3 ja enintään 25 merkkiä, poistaa haitalliset merkit
    body('mood').trim().notEmpty().isLength({ min: 3, max: 25 }).escape(),
    // Validoi paino: täytyy olla luku välillä 2-200
    body('weight', 'must be number between 2-200').isFloat({ min: 2, max: 200 }),
    // Validoi unen määrä: täytyy olla kokonaisluku välillä 0-24
    body('sleep_hours').isInt({ min: 0, max: 24 }),
    // Validoi muistiinpanot: poistaa haitalliset merkit ja tarkistaa mukautetulla validoinnilla
    body('notes').trim().escape().custom((value, { req }) => {
      // Mukautettu validointi: jos sisältö sama kuin mood-kentässä, ei mene läpi
      console.log('custom validator', value);
      return !(req.body.mood === value);
    }),
    // Käsittele validointivirheet
    validationErrorHandler,
    // Lisää uusi merkintä
    postEntry,
  )
  /**
   * @api {get} /api/entries Get all entries
   * @apiName GetEntries
   * @apiGroup Entries
   * @apiPermission token
   *
   * @apiHeader {String} Authorization Bearer token.
   * 
   * @apiSuccess {Object[]} entries List of entries
   * 
   * @apiError UnauthorizedError Authentication token was invalid.
   * @apiErrorExample Error-Response:
   *     HTTP/1.1 401 Unauthorized
   *     {
   *       "message": "invalid token"
   *     }
   */
  .get(authenticateToken, getEntries);

/**
 * @api {put} /api/entries/:id Update an entry by ID
 * @apiName UpdateEntryById
 * @apiGroup Entries
 * @apiPermission token
 *
 * @apiHeader {String} Authorization Bearer token.
 * 
 * @apiParam {Number} id Entry ID
 * 
 * @apiBody {String} entry_date Entry date
 * @apiBody {String} mood Mood
 * @apiBody {Number} weight Weight
 * @apiBody {Number} sleep_hours Sleep hours
 * @apiBody {String} notes Notes
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
 * @apiError NotFoundError Entry not found
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "Entry not found"
 *     }
 */
entryRouter
  .route('/:id')
  .put(
    // Varmista, että käyttäjä on kirjautunut
    authenticateToken,
    // Validoi merkinnän päivämäärä: ei saa olla tyhjä ja täytyy olla kelvollinen päivämäärä
    body('entry_date').notEmpty().isDate(),
    // Validoi ID: täytyy olla kokonaisluku
    param('id').isInt(),
    // Validoi mieliala: ei saa olla tyhjä, vähintään 3 ja enintään 25 merkkiä, poistaa haitalliset merkit
    body('mood').trim().notEmpty().isLength({ min: 3, max: 25 }).escape(),
    // Validoi paino: täytyy olla luku välillä 2-200
    body('weight').isFloat({ min: 2, max: 200 }),
    // Validoi unen määrä: täytyy olla kokonaisluku välillä 0-24
    body('sleep_hours').isInt({ min: 0, max: 24 }),
    // Validoi muistiinpanot: poistaa haitalliset merkit ja tarkistaa mukautetulla validoinnilla
    body('notes').trim().escape().custom((value, { req }) => {
      console.log('custom validator', value);
      return !(req.body.mood === value);
    }),
    // Käsittele validointivirheet
    validationErrorHandler,
    // Päivitä merkintä ID:n perusteella
    updateEntryById)
  /**
   * @api {delete} /api/entries/:id Delete an entry by ID
   * @apiName DeleteEntryById
   * @apiGroup Entries
   * @apiPermission token
   *
   * @apiHeader {String} Authorization Bearer token.
   * 
   * @apiParam {Number} id Entry ID
   * 
   * @apiSuccess {String} message Result of the request
   * 
   * @apiError NotFoundError Entry not found
   * @apiErrorExample Error-Response:
   *     HTTP/1.1 404 Not Found
   *     {
   *       "message": "Entry not found"
   *     }
   */
  .delete(
    // Varmista, että käyttäjä on kirjautunut
    authenticateToken,
    // Validoi ID: täytyy olla kokonaisluku
    param('id').isInt(),
    // Käsittele validointivirheet
    validationErrorHandler,
    // Poista merkintä ID:n perusteella
    deleteEntryById);

export default entryRouter;