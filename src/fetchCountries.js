export { fetchCountries };

function fetchCountries(name) {
  const url = `https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`;
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        return [];
      }
      return response.json();
    })
    .then(countryArray => {
      return countryArray;
    })
    .catch(error => {
      console.log(error);
    });
}
