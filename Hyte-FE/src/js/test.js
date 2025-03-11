const getData = async () => {
  try {
    // Tehdään pyyntö HTTP GET -metodilla
    const response = await fetch('https://api.chucknorris.io/jokes/random');
    console.log(response);

    // Muunnetaan vastaus JSON-muotoon
    const data = await response.json();
    console.log(data);

    // Tulostetaan vitsin arvo konsoliin
    console.log(data.value);
  } catch (error) {
    // Käsitellään mahdolliset virheet pyynnön aikana
    console.error('Virhe:', error);
  }
};

export { getData };