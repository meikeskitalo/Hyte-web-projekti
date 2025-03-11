import '../css/style.css';
import '../css/snackbar.css';
import { getItems } from './items.js';
import { getUsers, addUser } from './users.js';
import { getEntries, addEntry } from './entries.js';

// Haetaan nappi tavaroiden hakemiseen ja lisätään tapahtumankuuntelija
const getItemBtn = document.querySelector('.get_items');
getItemBtn.addEventListener('click', getItems);

// Haetaan nappi käyttäjien hakemiseen ja lisätään tapahtumankuuntelija
const getUserBtn = document.querySelector('.get_users');
getUserBtn.addEventListener('click', getUsers);

// Haetaan lomake käyttäjän lisäämiseen ja lisätään tapahtumankuuntelija
const addUserForm = document.querySelector('.formpost');
addUserForm.addEventListener('click', addUser);

// Haetaan nappi merkintöjen hakemiseen ja lisätään tapahtumankuuntelija
const getEntriesBtn = document.querySelector('.get_entries');
getEntriesBtn.addEventListener('click', getEntries);