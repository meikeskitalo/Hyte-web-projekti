import promisePool from '../utils/database.js';

/**
 * Hakee kaikki käyttäjätiedot paitsi salasanat tietokannasta
 * @returns {Array} käyttäjätiedot
 */
const selectAllUsers = async () => {
  const [rows] = await promisePool.query(
    'SELECT user_id, username, email, created_at, user_level FROM Users',
  );
  console.log('selectAllUsers result', rows);
  return rows;
};

/**
 * Hakee käyttäjän ID:n perusteella
 * Käyttää valmisteltua lausetta (suositeltu tapa)
 * Esimerkki virheenkäsittelystä
 * @param {number} userId käyttäjän ID
 * @returns {object} löydetty käyttäjä tai undefined jos ei löydy
 */
const selectUserById = async (userId) => {
  try {
    const [rows] = await promisePool.query(
      'SELECT user_id, username, email, created_at, user_level FROM Users WHERE user_id=?',
      [userId],
    );
    console.log(rows);
    // palauttaa vain ensimmäisen tuloksen
    return rows[0];
  } catch (error) {
    console.error(error);
    throw new Error('database error');
  }
};

/**
 * Käyttäjän rekisteröinti
 * @param {object} user käyttäjän tiedot
 * @returns {number} lisätyn käyttäjän ID
 */
const insertUser = async (user) => {
  // try {
  const [result] = await promisePool.query(
    'INSERT INTO Users (username, password, email) VALUES (?, ?, ?)',
    [user.username, user.password, user.email],
  );
  console.log('insertUser', result);
  // palauttaa lisätyn käyttäjän ID:n
  return result.insertId;
  // } catch (error) {
  //   console.error(error);
  //   throw new Error('database error');
  // }
};

/**
 * TURVATON kirjautuminen selväkielisillä salasanoilla
 * @param {string} username käyttäjänimi
 * @param {string} password salasana
 * @returns {object} löydetty käyttäjä tai undefined jos ei löydy
 */
const selectUserByNameAndPassword = async (username, password) => {
  try {
    const [rows] = await promisePool.query(
      'SELECT user_id, username, email, created_at, user_level FROM Users WHERE username=? AND password=?',
      [username, password],
    );
    console.log(rows);
    // palauttaa vain ensimmäisen tuloksen
    return rows[0];
  } catch (error) {
    console.error(error);
    throw new Error('database error');
  }
};

/**
 * Hakee kaikki käyttäjätiedot käyttäjänimen perusteella
 * @param {string} username käyttäjänimi
 * @returns {object} käyttäjätiedot
 */
const selectUserByUsername = async (username) => {
  try {
    const [rows] = await promisePool.query(
      'SELECT user_id, username, password, email, created_at, user_level FROM Users WHERE username=?',
      [username],
    );
    console.log(rows);
    // palauttaa vain ensimmäisen tuloksen
    return rows[0];
  } catch (error) {
    console.error(error);
    throw new Error('database error');
  }
};

/**
 * Muokkaa käyttäjän tietoja käyttäjän ID:n perusteella
 * @param {number} userId käyttäjän ID
 * @param {object} updatedUser päivitetyt käyttäjätiedot
 * @returns {boolean} true jos muokkaus onnistui, muuten false
 */
const modifyUserByUserId = async (userId, updatedUser) => {
  try {
    const [result] = await promisePool.query(
      'UPDATE Users SET username=?, password=?, email=? WHERE user_id=?',
      [updatedUser.username, updatedUser.password, updatedUser.email, userId],
    );
    console.log('modifyUserByUserId', result);
    return result.affectedRows === 1;
  } catch (error) {
    console.error(error);
    throw new Error('database error');
  }
};

/**
 * Poistaa käyttäjän käyttäjän ID:n perusteella
 * @param {number} userId käyttäjän ID
 * @returns {boolean} true jos poisto onnistui, muuten false
 */
const deleteUserByUserId = async (userId) => {
  try {
    const [result] = await promisePool.query(
      'DELETE FROM Users WHERE user_id=?',
      [userId],
    );
    console.log('deleteUserByUserId', result);
    return result.affectedRows === 1;
  } catch (error) {
    console.error(error);
    throw new Error('database error');
  }
};

export {
  selectAllUsers,
  selectUserById,
  insertUser,
  selectUserByNameAndPassword,
  selectUserByUsername,
  modifyUserByUserId,
  deleteUserByUserId,
};