import { getEntries, addEntry } from './entries.js';
import { fetchData } from './fetch.js';
import { checkUser } from './auth.js';
import '../css/style.css';
import '../css/snackbar.css';
import { editUser } from './users.js';

// Lataa merkinnät
getEntries();

// Päivitä tervehdys
const welcomeName = async () => {
  // Tarkista käyttäjän tiedot
  const user = await checkUser();
  console.log(user);
  const name = user.username;
  document.getElementById("updated-username").innerHTML = `&nbsp${name}`;

  // Näytä admin-painike, jos käyttäjä on admin
  if (user.user_level == "admin") {
    const adminBTn = document.getElementById("admin-button");
    adminBTn.style.visibility = "visible";
    adminBTn.addEventListener("click", () => {
      window.location.href = '/src/pages/adminpanel.html';
    });
  } else {
    document.getElementById("admin-button").style.visibility = "hidden";
  }
};

welcomeName();

// Kirjaudu ulos
const logoutBtn = document.getElementById('logout-button');
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('token');
  window.location.href = '/src/pages/index.html';
});

// Näytä tietoja minusta -dialogi
const aboutMeDialog = document.getElementById('about-me-dialog');

const aboutMeBtn = document.getElementById('about-me-button');
aboutMeBtn.addEventListener('click', async () => {
  // Hae käyttäjän tiedot
  const userDetails = await checkUser();

  // Aseta käyttäjän tiedot dialogiin
  const name = document.getElementById('username-edit');
  name.setAttribute("value", userDetails.username);

  const email = document.getElementById('email-edit');
  email.setAttribute("value", userDetails.email);

  document.getElementById("about-me-dialog").showModal();
});

// Lisää uusi merkintä
const addEntryBtn = document.getElementById('add-button');
addEntryBtn.addEventListener('click', () => {
  document.getElementById("add-dialog").showModal();
});

// Sulje dialogit, kun klikataan niiden ulkopuolelle
const dialogs = document.querySelectorAll('.dialog');
dialogs.forEach(dialog => {
  window.addEventListener('click', (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
  });
});

// Sulje dialogit, kun sulkupainiketta klikataan
const closeButtons = document.querySelectorAll('.close');
closeButtons.forEach(button => {
  button.addEventListener('click', () => {
    aboutMeDialog.close();
  });
});

// Lähetä päiväkirjamerkintä
const diaryFormButton = document.getElementById('diary-submit');
diaryFormButton.addEventListener('click', (event) => {
  event.preventDefault();
  console.log("diaryFormButton clicked");
  addEntry(event);
  document.getElementById("add-dialog").close();
});

// Päivitä käyttäjän tiedot
const userEditFormButton = document.getElementById('user-edit-submit');
userEditFormButton.addEventListener('click', (event) => {
  event.preventDefault();
  console.log("userinfo updated");
  editUser(event);
  document.getElementById("about-me-dialog").close();
});