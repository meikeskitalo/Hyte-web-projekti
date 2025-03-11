import { fetchData } from './fetch';

const snackbar = document.getElementById('snackbar');

// Funktio näyttää snackbar-viestin
const showSnackbar = (message, type = '') => {
  snackbar.innerText = message;
  snackbar.className = `show ${type}`.trim(); // Lisää valinnainen tyyppiluokka (esim. 'error')

  setTimeout(() => {
    snackbar.className = snackbar.className.replace('show', '').trim();
  }, 3000);
};

// Funktio käyttäjien hakemiseen
const getUsers = async () => {
  const url = 'http://localhost:3000/api/users';

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
  console.log(options);

  // Haetaan käyttäjätiedot
  const users = await fetchData(url, options);

  // Käsitellään virheet haussa
  if (users.error) {
    console.log('Tapahtui virhe fetch haussa!!');
    return;
  }

  console.log(users);

  // Valitaan taulukon body-elementti ja tyhjennetään sen sisältö
  const tableBody = document.querySelector('.tbody');
  tableBody.innerHTML = ''; // Tyhjennetään taulukko

  // Täytetään taulukko käyttäjätiedoilla
  users.forEach((user) => {
    const row = document.createElement('tr');

    row.innerHTML = `
        <td>${user.username}</td>
        <td>${user.email}</td>
        <td><button class="check" data-id="${user.user_id}">Info</button></td>
        <td><button class="del" data-id="${user.user_id}">Delete</button></td>
        <td>${user.user_id}</td>
      `;

    tableBody.appendChild(row);
  });

  // Lisätään tapahtumankuuntelijat nappeihin
  addEventListeners();
};

// Funktio tapahtumankuuntelijoiden lisäämiseen nappeihin
const addEventListeners = () => {
  const nappulat = document.querySelectorAll('.check');
  console.log(nappulat);
  nappulat.forEach((button) => {
    button.addEventListener('click', async (event) => {
      console.log('Klikkasit nappulaa:', event.target);
      const userId = event.target.dataset.id;
      console.log('Haetaan tietoja käyttäjälle id:llä:', userId);

      // Haetaan käyttäjän tiedot ID:n perusteella
      const user = await getUserById(userId);
      console.log(user);

      // Näytetään käyttäjätiedot dialogissa
      if (user) {
        dialog.querySelector('p').innerHTML = '';
        dialog.showModal();
        dialog.querySelector('p').innerHTML = `
          <div>User ID: <span>${user.user_id}</span></div>
          <div>User Name: <span>${user.username}</span></div>
          <div>Email: <span>${user.email}</span></div>
          <div>Role: <span>${user.user_level}</span></div>`;
      }
    });
  });
};

// Funktio käyttäjätietojen hakemiseen ID:n perusteella
const getUserById = async (userId) => {
  const user = await fetchData(`http://localhost:3000/api/users/${userId}`);

  // Käsitellään virheet haussa
  if (user.error) {
    console.error(`Error fetching item with ID ${userId}:`, user.error);
    alert(`Error: ${user.error}`);
    return null;
  }
  return user;
};

// Funktio käyttäjän tietojen muokkaamiseen
const editUser = async (event) => {
  event.preventDefault();

  const updateform = document.getElementById("about-me-form");

  // Haetaan formista oikea tieto mikä on täytetty .value
  const username = document.querySelector('#username-edit').value.trim();
  const password = document.querySelector('#password-edit').value.trim();
  const email = document.querySelector('#email-edit').value.trim();

  // url
  const url = 'http://localhost:3000/api/users';

  // PUT
  // content-type: application/json

  const bodyData = {
    username: username,
    password: password,
    email: email,
  };

  // options eli mikä metodi, headers ja JSON
  const token = localStorage.getItem('token');

  const options = {
    body: JSON.stringify(bodyData),
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-type': 'application/json',
    },
  };
  console.log(options);

  // Lähetetään data palvelimelle
  const response = await fetchData(url, options);

  // Käsitellään virheet haussa
  if (response.error) {
    // On hyvä jättää oikea virhe ns. koodareille luettavaksi
    console.log(response.error);
    // Käyttäjän viesti!!
    showSnackbar(
      'Virhe lähettämisessä, täytä kaikki vaadittavat kentät!',
      'error',
    );
    return;
  }

  // Päivitetään käyttäjän nimi käyttöliittymässä
  document.getElementById("updated-username").innerHTML = `&nbsp${username}`;

  // Käsitellään onnistunut vastaus
  if (response.message) {
    console.log(response.message);
    // showSnackbar('Onnistunut käyttäjän tietojen päivitys :) 💕', 'success');
  }

  console.log(response);
  updateform.reset(); // Tyhjennetään formi
};

// Funktio uuden käyttäjän lisäämiseen
const addUser = async (event) => {
  event.preventDefault();

  // Haetaan formista oikea tieto mikä on täytetty .value
  const username = document.querySelector('#username').value.trim();
  const password = document.querySelector('#password').value.trim();
  const email = document.querySelector('#email').value.trim();

  // url
  const url = 'http://localhost:3000/api/users';

  // POST
  // content-type: application/json

  const bodyData = {
    username: username,
    password: password,
    email: email,
  };

  // options eli mikä metodi, headers ja JSON
  const options = {
    body: JSON.stringify(bodyData),
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
  };
  console.log(options);

  // Lähetetään data palvelimelle
  const response = await fetchData(url, options);

  // Käsitellään virheet haussa
  if (response.error) {
    // On hyvä jättää oikea virhe ns. koodareille luettavaksi
    console.log(response.error);
    // Käyttäjän viesti!!
    showSnackbar(
      'Virhe lähettämisessä, täytä kaikki vaadittavat kentät!',
      'error',
    );
    return;
  }

  // Käsitellään onnistunut vastaus
  if (response.message) {
    console.log(response.message);
    showSnackbar('Onnistunut käyttäjän lisääminen :) 💕', 'success');
  }

  console.log(response);
  document.querySelector('.addform').reset(); // Tyhjennetään formi
};

export { getUsers, addUser, editUser };