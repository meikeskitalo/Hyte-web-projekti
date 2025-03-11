import '../css/style.css';
import '../css/snackbar.css';
import { fetchData } from './fetch.js';

// Funktio käyttäjän rekisteröimiseen
const registerUser = async (event) => {
  event.preventDefault();

  // Haetaan oikea formi
  const registerForm = document.querySelector('.login-form');

  // Haetaan formista arvot
  const username = registerForm.querySelector('input[name=username]').value.trim();
  const password = registerForm.querySelector('input[name=password]').value;
  const email = registerForm.querySelector('input[name=email]').value.trim();

  // Luodaan body lähetystä varten taustapalvelun vaatimaan muotoon
  const bodyData = {
    username: username,
    password: password,
    email: email
  };

  // Endpoint
  const url = 'http://localhost:3000/api/users';

  // Options
  const options = {
    body: JSON.stringify(bodyData),
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
  };
  console.log(options);

  // Hae data
  const response = await fetchData(url, options);

  // Käsitellään virheet haussa
  if (response.error) {
    console.error('Error adding a new user:', response.error);
    return;
  }

  // Käsitellään onnistunut vastaus
  if (response.message) {
    console.log(response.message, 'success');
  }

  console.log(response);
  registerForm.reset(); // tyhjennetään formi
  registerForm.querySelector('input[name=username]').value = username;
  document.querySelector(".register-checkbox").checked = false;

  // Piilotetaan sähköpostikentät
  const hiddenFields = document.querySelectorAll('.hidden-email');
  hiddenFields.forEach(field => {
    field.classList.add('hidden');
    field.setAttribute('hidden', 'hidden');
    if (field.tagName === 'INPUT') {
      field.removeAttribute('required');
    }
    document.querySelector(".loginform").value = "Kirjaudu sisään";
  });
};

// Funktio käyttäjän kirjautumiseen
const loginUser = async (event) => {
  event.preventDefault();

  // Haetaan oikea formi
  const loginForm = document.querySelector('.login-form');

  // Haetaan formista arvot, tällä kertaa käyttäen attribuuutti selektoreita
  const username = loginForm.querySelector('input[name=username]').value;
  const password = loginForm.querySelector('input[name=password]').value;

  // Luodaan body lähetystä varten taustapalvelun vaatimaan muotoon
  const bodyData = {
    username: username,
    password: password,
  };

  // Endpoint
  const url = 'http://localhost:3000/api/auth/login';

  // Options
  const options = {
    body: JSON.stringify(bodyData),
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
  };
  console.log(options);

  // Hae data
  const response = await fetchData(url, options);

  // Käsitellään virheet haussa
  if (response.error) {
    console.error('Error adding a new user:', response.error);
    return;
  }

  // Käsitellään onnistunut vastaus
  if (response.message) {
    console.log(response.message, 'success');
    localStorage.setItem('token', response.token);
    localStorage.setItem('nimi', response.user.username);
  }

  console.log(response);
  loginForm.reset(); // tyhjennetään formi
  window.location.href = '/src/pages/healthdiary.html'; // Uudelleenohjataan käyttäjä healthdiary-sivulle
};

// Funktio käyttäjän tietojen tarkistamiseen
const checkUser = async (event) => {
  if (event) {
    event.preventDefault();
  }

  // Endpoint
  const url = 'http://localhost:3000/api/auth/me';

  // Kutsun headers tiedot johon liitetään tokeni
  let headers = {};

  // Nyt haetaan Token localstoragesta
  const token = localStorage.getItem('token');

  // Muodostetaan nyt headers oikeaan muotoon
  headers = { Authorization: `Bearer ${token}` };

  // Options
  const options = {
    headers: headers,
  };

  // Hae data
  const response = await fetchData(url, options);

  // Käsitellään virheet haussa
  if (response.error) {
    console.error('Error getting personal data:', response.error);
    return;
  }

  // Käsitellään onnistunut vastaus
  if (response.message) {
    console.log(response.message, 'success');
  }
  return response;
};

export { loginUser, registerUser, checkUser };