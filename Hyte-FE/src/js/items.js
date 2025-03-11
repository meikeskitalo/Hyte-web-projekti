import { fetchData } from './fetch';

// Funktio tavaroiden hakemiseen
const getItems = async () => {
  // Määritellään API:n päätepisteen URL
  const url = 'http://localhost:3000/api/items';
  
  // Haetaan data API:sta
  const items = await fetchData(url);

  // Käsitellään virheet haussa
  if (items.error) {
    console.log('Tapahtui virhe fetch haussa!!');
    return;
  }

  // Tulostetaan haetut tavarat konsoliin
  console.log(items);
};

export { getItems };