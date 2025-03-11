import '../css/adminstyle.css';
import '../css/snackbar.css';
import { fetchData } from './fetch';

// Valitaan dialogi ja sulkupainike elementit
const dialog = document.querySelector('.info_dialog');
const closeButton = document.querySelector('.info_dialog button');

// Lisätään tapahtumankuuntelija sulkemaan dialogi, kun sulkupainiketta klikataan
closeButton.addEventListener('click', () => {
  dialog.close();
});

// Funktio käyttäjien hakemiseen ja näyttämiseen
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
          <td><button class="check" data-id="${user.user_id}">Tietoja</button></td>
          <td><button class="del" data-id="${user.user_id}">Poista</button></td>
          <td>${user.user_id}</td>
        `;

    tableBody.appendChild(row);
  });

  // Lisätään tapahtumankuuntelijat nappeihin
  addEventListeners();
};

// Funktio tapahtumankuuntelijoiden lisäämiseen nappeihin
const addEventListeners = () => {
  // Lisätään tapahtumankuuntelijat poistonappeihin
  const deletet = document.querySelectorAll(".del")
  deletet.forEach((button) => {
    button.addEventListener("click", async (event) => {
      const userId = event.target.dataset.id;
      const result = await deleteUserById(userId);
      getUsers()
    })
  });

  // Lisätään tapahtumankuuntelijat infonappeihin
  const nappulat = document.querySelectorAll('.check');
  console.log(nappulat);
  nappulat.forEach((button) => {
    button.addEventListener('click', async (event) => {
      console.log('Klikkasit nappulaa:', event.target);
      const userId = event.target.dataset.id;
      console.log('Haetaan tietoja käyttäjälle id:llä:', userId);

      const user = await getUserById(userId);
      console.log(user);

      // Näytetään käyttäjätiedot dialogissa
      if (user) {
        dialog.querySelector('p').innerHTML = '';
        dialog.showModal();
        dialog.querySelector('p').innerHTML = `
            <div>Käyttäjän ID: <span>${user.user_id}</span></div>
            <div>Käyttäjänimi: <span>${user.username}</span></div>
            <div>Sähköposti: <span>${user.email}</span></div>
            <div>Rooli: <span>${user.user_level}</span></div>`;
      }
    });
  });
};

// Funktio käyttäjätietojen hakemiseen ID:n perusteella
const getUserById = async (userId) => {
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
  const user = await fetchData(`http://localhost:3000/api/users/${userId}`, options);

  // Käsitellään virheet haussa
  if (user.error) {
    console.error(`Error fetching item with ID ${userId}:`, user.error);
    alert(`Error: ${user.error}`);
    return null;
  }
  return user;
};

// Funktio käyttäjän poistamiseen ID:n perusteella
const deleteUserById = async (userId) => {
  const url = `http://localhost:3000/api/users/${userId}`;

  // Nyt haetaan Token localstoragesta
  const token = localStorage.getItem('token');

  // Options
  const options = {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    },
  };

  // Lähetetään poisto-pyyntö
  const result = await fetchData(url, options)

  // Käsitellään virheet poistossa
  if (result.error) {
    console.error(`Error deleting item with ID ${userId}:`, result.error);
    alert(`Error: ${result.error}`);
    return null;
  }
  return result;
};

// Lisätään tapahtumankuuntelija nappiin käyttäjien hakemiseksi
const getUserBtn = document.querySelector('.get_users');
getUserBtn.addEventListener('click', getUsers);