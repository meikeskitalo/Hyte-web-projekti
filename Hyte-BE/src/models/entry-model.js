import promisePool from '../utils/database.js';

/**
 * Lisää uusi merkintä tietokantaan
 * @param {object} entry merkinnän tiedot
 * @returns {number} lisätyn merkinnän ID
 */
const insertEntry = async (entry) => {
  try {
    const [result] = await promisePool.query(
      'INSERT INTO DiaryEntries (user_id, entry_date, mood, weight, sleep_hours, notes) VALUES (?, ?, ?, ?, ? ,?)',
      [entry.user_id, entry.entry_date, entry.mood, entry.weight, entry.sleep_hours, entry.notes],
    );
    console.log('insertEntry', result);
    // palauttaa lisätyn merkinnän ID:n
    return result.insertId;
  } catch (error) {
    console.error(error);
    throw new Error('database error');
  }
};

/**
 * Hakee kaikki merkinnät käyttäjän ID:n perusteella
 * @param {number} userId käyttäjän ID
 * @returns {Array} merkinnät
 */
const selectEntriesByUserId = async (userId) => {
  try {
    const [rows] = await promisePool.query(
      'SELECT * FROM DiaryEntries WHERE user_id=?',
      [userId],
    );
    console.log(rows);
    return rows;
  } catch (error) {
    console.error(error);
    throw new Error('database error');
  }
};

/**
 * Muokkaa merkintää merkinnän ID:n ja käyttäjän ID:n perusteella
 * @param {number} entryId merkinnän ID
 * @param {number} userId käyttäjän ID
 * @param {object} entry päivitetyt merkinnän tiedot
 * @returns {boolean} true jos muokkaus onnistui, muuten false
 */
const modifyEntryByEntryIdAndUserId = async (entryId, userId, entry) => {
  try {
    const [result] = await promisePool.query(
      'UPDATE DiaryEntries SET entry_date=?, mood=?, weight=?, sleep_hours=?, notes=? WHERE entry_id=? AND user_id=?',
      [entry.entry_date, entry.mood, entry.weight, entry.sleep_hours, entry.notes, entryId, userId],
    );
    console.log('modifyEntryByIdAndUserId', result);
    return result.affectedRows === 1;
  } catch (error) {
    console.error(error);
    throw new Error('database error');
  }
}

/**
 * Poistaa merkinnän merkinnän ID:n ja käyttäjän ID:n perusteella
 * @param {number} entryId merkinnän ID
 * @param {number} userId käyttäjän ID
 * @returns {boolean} true jos poisto onnistui, muuten false
 */
const deleteEntryByEntryIdAndUserId = async (entryId, userId) => {
  try {
    const [result] = await promisePool.query(
      'DELETE FROM DiaryEntries WHERE entry_id=? AND user_id=?',
      [entryId, userId],
    );
    console.log('deleteEntryByEntryIdAndUserId', result);
    return result.affectedRows === 1;
  } catch (error) {
    console.error(error);
    throw new Error('database error');
  }
}

export { insertEntry, selectEntriesByUserId, modifyEntryByEntryIdAndUserId, deleteEntryByEntryIdAndUserId };