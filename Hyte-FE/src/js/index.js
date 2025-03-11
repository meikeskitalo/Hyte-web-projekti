import '../css/style.css';
import '../css/snackbar.css';
// import {fetchData} from './fetch.js';
// import {getEntries, addEntry} from './entries.js';
import { loginUser, registerUser, checkUser } from './auth.js';

// Tarkistetaan, onko käyttäjä kirjautunut sisään
if (checkUser().error) {
  window.location.href = '/src/pages/healthdiary.html';
}

// Haetaan login-formi
const loginForm = document.querySelector('.login-form');
loginForm.addEventListener('click', (event) => {
  const checkbox = document.querySelector(".register-checkbox");

  // Jos rekisteröitymisruutu ei ole valittuna, kirjaudutaan sisään
  if (!checkbox.checked) {
    loginUser(event);
  } else {
    // Muuten rekisteröidytään
    registerUser(event);
  }
});

// Haetaan rekisteröitymisruutu
const registerCheckbox = document.querySelector('.register-checkbox');
registerCheckbox.addEventListener('change', (event) => {
  const hiddenFields = document.querySelectorAll('.hidden-email');
  const visible = event.target.checked;

  // Näytetään tai piilotetaan sähköpostikentät rekisteröitymisruudun tilan mukaan
  hiddenFields.forEach(field => {
    if (visible) {
      field.classList.remove('hidden');
      field.removeAttribute('hidden');
      document.querySelector(".loginform").value = "Rekisteröidy";
      if (field.tagName === 'INPUT') {
        field.setAttribute('required', 'required');
      }
    } else {
      field.classList.add('hidden');
      field.setAttribute('hidden', 'hidden');
      if (field.tagName === 'INPUT') {
        field.removeAttribute('required');
      }
      document.querySelector(".loginform").value = "Kirjaudu sisään";
    }
  });
});