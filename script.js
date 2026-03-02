document.addEventListener("DOMContentLoaded", () => {

  const country = document.getElementById("country-input");
  const searchBtn = document.getElementById("search-btn");

  
  searchBtn.addEventListener("click", () => {
    const countryName = country.value;
    if (countryName) searchCountry(countryName);
  });

  
  country.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const countryName = country.value;
      if (countryName) searchCountry(countryName);
    }
  });
});


async function searchCountry(countryName) {
  const spinner = document.getElementById("loading-spinner");
  const countryInfo = document.getElementById("country-info");
  const borderingSection = document.getElementById("bordering-countries");
  const errormessage = document.getElementById("error-message");

  
   countryInfo.innerHTML = "";
  borderingSection.innerHTML = "";
  errormessage.textContent = "";

  
  spinner.classList.remove("hidden");

  try {

    const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
    
    if (!response.ok) throw new Error("Country not found");
    
    const data = await response.json();
    const country = data[0]; 

    
   document.getElementById('country-info').innerHTML = `
    <h2>${country.name.common}</h2>
    <p><strong>Capital:</strong> ${country.capital[0]}</p>
    <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
    <p><strong>Region:</strong> ${country.region}</p>
    <img src="${country.flags.svg}" alt="${country.name.common} flag">
`;

    
    if (country.borders && country.borders.length > 0) {
        borderingSection.innerHTML = "<h3>Bordering Countries</h3>";
      for (let code of country.borders) {
        try {
          const borderResp = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
          const borderData = await borderResp.json();
          const borderCountry = borderData[0];
          
          const article = document.createElement("article");
          article.innerHTML = `
            <h3>${borderCountry.name.common}</h3>
            <img src="${borderCountry.flags.svg}" alt="${borderCountry.name.common} flag" width="80">
          `;
          borderingSection.appendChild(article);

        } catch (err) {
          console.error("We could not fetch bordering country:", err);
        }
      }
    }
    else {
  borderingSection.innerHTML = "<p>No bordering countries</p>";
}

  } catch (error) {
    console.error(error);
    errormessage.textContent = "That country is not found";
  } finally {
    
    spinner.classList.add("hidden");
  }
}