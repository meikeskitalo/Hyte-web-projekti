import { fetchData } from './fetch';

// Funktio merkintöjen hakemiseen
const getEntries = async () => {

  // Haetaan alue, johon luodaan kortit
  const diaryContainer = document.querySelector('.card-area');

  // Haetaan data joko JSON-muodossa tai fetch-rajapinnasta
  const url = 'http://localhost:3000/api/entries';
  const options = {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  };
  const response = await fetchData(url, options);

  // Käsitellään virheet haussa
  if (response.error) {
    console.log('Tapahtui virhe fetch haussa!!');
    return;
  }

  // Tyhjennetään alue ennen uusien korttien luomista
  diaryContainer.innerHTML = '';

  // Jos merkintöjä ei löydy, näytetään viesti
  if (response.length === 0) {
    const noEntries = document.createElement('p');
    noEntries.textContent = 'No entries found';
    diaryContainer.appendChild(noEntries);
    return;
  }

  // Luodaan yksittäiset kortit merkinnöistä
  response.forEach((entry) => {
    const card = document.createElement('div');
    card.classList.add('card');

    const cardImg = document.createElement('div');
    cardImg.classList.add('card-img');

    // Luodaan poisto- ja muokkauspainikkeet
    const deleteAndEdit = document.createElement('div');
    deleteAndEdit.id = 'delete-and-edit';
    const deleteIcon = document.createElement('img');
    deleteIcon.src = '/img/delete.svg';
    deleteIcon.alt = 'Delete Icon';
    deleteIcon.setAttribute("data-id", entry.entry_id);
    deleteIcon.addEventListener("click", (event) => {
      const entryId = event.target.dataset.id;
      deleteEntry(entryId);
      getEntries();
    });
    deleteAndEdit.appendChild(deleteIcon);

    const editIcon = document.createElement('img');
    editIcon.src = '/img/edit.svg';
    editIcon.alt = 'Edit Icon';
    editIcon.setAttribute("data-id", entry.entry_id);
    editIcon.addEventListener("click", (event) => {
      const entryId = event.target.dataset.id;
      // Muokkaa merkintää, toteutetaan myöhemmin. Näytetään snackbar toistaiseksi.
      const bar = document.getElementById("snackbar");
      bar.innerHTML = "Ominaisuus tulossa. Tässä snackbar!";
      bar.className = "show";
      setTimeout(() => {
        bar.className = bar.className.replace("show", "");
      }, 3000);
    });
    deleteAndEdit.appendChild(editIcon);

    cardImg.appendChild(deleteAndEdit);

    const img = document.createElement('img');
    img.src = '/img/diary.png';
    img.id = 'diary-image';
    img.alt = 'Diary Image';
    cardImg.appendChild(img);

    const cardDiary = document.createElement('div');
    cardDiary.classList.add('card-diary');

    // Muotoillaan päivämäärä
    const formattedDate = new Date(entry.entry_date).toLocaleDateString('fi-FI');

    // Lisätään merkinnän tiedot korttiin
    cardDiary.innerHTML = `
      <p><strong>Päivämäärä:</strong> ${formattedDate}</p>
      <p><strong>Olotila:</strong> ${entry.mood}</p>
      <p><strong>Paino:</strong> ${entry.weight} kg</p>
      <p><strong>Uni:</strong> ${entry.sleep_hours} hours</p>
      <p><strong>Kuvaus:</strong> ${entry.notes}</p>
    `;

    card.appendChild(cardImg);
    card.appendChild(cardDiary);
    diaryContainer.appendChild(card);
  });
};

// Funktio uuden merkinnän lisäämiseen
const addEntry = async () => {
  console.log('Lähetetään data palvelimelle');

  const addForm = document.getElementById('add-form');

  // Haetaan formista arvot
  const date = addForm.querySelector('input[name=date]').value;
  const mood = addForm.querySelector('input[name=mood]').value;
  const weight = addForm.querySelector('input[name=weight]').value;
  const sleep_hours = addForm.querySelector('input[name=sleep_hours]').value;
  const notes = addForm.querySelector('input[name=notes]').value;

  // Luodaan body lähetystä varten taustapalvelun vaatimaan muotoon
  const bodyData = {
    entry_date: date,
    mood: mood,
    weight: weight,
    sleep_hours: sleep_hours,
    notes: notes,
  };

  console.log(bodyData);

  // Endpoint
  const url = 'http://localhost:3000/api/entries';

  // Options
  const options = {
    body: JSON.stringify(bodyData),
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  };

  // Lähetetään data palvelimelle
  const response = await fetchData(url, options);
  if (response.error) {
    console.log('Tapahtui virhe fetch haussa!!');
    return;
  }
  if (response.message) {
    console.log(response.message);
  }
  addForm.reset(); // Tyhjennetään formi
  getEntries(); // Päivitetään merkinnät
  console.log(response);
};

// Funktio merkinnän poistamiseen
const deleteEntry = async (entryId) => {
  // Endpoint
  const url = `http://localhost:3000/api/entries/${entryId}`;

  // Options
  const options = {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  };

  // Lähetetään poisto-pyyntö palvelimelle
  const response = await fetchData(url, options);
  if (response.error) {
    console.log('Tapahtui virhe fetch haussa!!');
    return;
  }
  if (response.message) {
    console.log(response.message);
  }
}

// Funktio merkinnän muokkaamiseen (toteutetaan myöhemmin)
const editEntry = async () => {

}

export { getEntries, addEntry, deleteEntry, editEntry };