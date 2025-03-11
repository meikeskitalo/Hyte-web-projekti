import { customError } from '../middlewares/error-handler.js';
import { insertEntry, selectEntriesByUserId, modifyEntryByEntryIdAndUserId, deleteEntryByEntryIdAndUserId } from '../models/entry-model.js';

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
const postEntry = async (req, res, next) => {
  // user_id, entry_date, mood, weight, sleep_hours, notes
  const newEntry = req.body;
  newEntry.user_id = req.user.user_id; // Lisätään käyttäjän ID merkintään
  try {
    await insertEntry(newEntry);
    res.status(201).json({ message: "Entry added." });
  } catch (error) {
    next(error); // Välitetään virhe seuraavalle middlewarelle
  }
};

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
const getEntries = async (req, res, next) => {
  try {
    const entries = await selectEntriesByUserId(req.user.user_id);
    res.json(entries);
  } catch (error) {
    next(error); // Välitetään virhe seuraavalle middlewarelle
  }
};

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
const updateEntryById = async (req, res, next) => {
  const entryId = req.params.id;
  const userId = req.user.user_id;
  const updatedEntry = req.body;

  try {
    const result = await modifyEntryByEntryIdAndUserId(entryId, userId, updatedEntry);
    res.json({ message: 'Entry updated: ' + result });
  } catch (error) {
    next(customError('EntryId not found for user: ' + error.message, 404)); // Välitetään virhe seuraavalle middlewarelle
  }
};

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
const deleteEntryById = async (req, res, next) => {
  const entryId = req.params.id;
  const userId = req.user.user_id;

  try {
    const result = await deleteEntryByEntryIdAndUserId(entryId, userId);
    res.json({ message: 'Entry deleted: ' + result });
  } catch (error) {
    next(customError('EntryId not found for user: ' + error.message, 404)); // Välitetään virhe seuraavalle middlewarelle
  }
};

export { postEntry, getEntries, updateEntryById, deleteEntryById };