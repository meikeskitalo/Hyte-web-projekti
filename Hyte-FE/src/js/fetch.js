/**
 * Hakee JSON-dataa API:sta
 *
 * @param {string} url - API:n päätepisteen URL
 * @param {Object} options - pyyntöasetukset, metodit GET oletuksena, POST, DELETE
 *
 * @returns {Object} response json data
 */
const fetchData = async (url, options = {}) => {
  try {
    // Lähetetään pyyntö annettuun URL:iin annetuilla asetuksilla
    const response = await fetch(url, options);

    // Tarkistetaan, onko vastaus ok (statuskoodi 200-299)
    if (!response.ok) {
      // Jos vastaus ei ole ok, haetaan virhedata ja palautetaan se
      const errorData = await response.json();
      return { error: errorData.message || 'Tapahtui virhe' };
    }
    // Palautetaan onnistunut vastausdata
    return await response.json();
  } catch (error) {
    // Käsitellään mahdolliset virheet pyynnön aikana
    console.error('fetchData() virhe:', error.message);
    return { error: error.message };
  }
};

export { fetchData };