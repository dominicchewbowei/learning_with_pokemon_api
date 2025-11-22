const requestOptions = {
  method: "GET",
  redirect: "follow"
};

let loadingPokemon = false;

let data;

let mapPokemonData = new Map();

fetch("https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0", requestOptions)
  .then((response) => response.text())
  .then((result) => {
    data = JSON.parse(result);
    console.log(data.results.length);
    const divElement = document.getElementById("pokemon-list");
    for (let i = 0; i < data.results.length; i++) {
      //console.log(`${data.results.name}`);
      const currentPokemonNode = document.createElement('a');
      currentPokemonNode.textContent = `#${String(i + 1).padStart(4, '0')} \t ${data.results[i].name}`;
      currentPokemonNode.id = `${data.results[i].name}`;
      divElement.appendChild(currentPokemonNode);

      // add api url to map object
      mapPokemonData[data.results[i].name] = new Object();
      mapPokemonData[data.results[i].name].apiUrl = data.results[i].url;
      //console.log(mapPokemonData[data.results[i].name].apiUrl);

      // add event listener
      currentPokemonNode.addEventListener('dblclick', function (event) {
        const elementId = event.target.id;
        if (!loadingPokemon) {
          loadingPokemon = true;
          console.log(`Begin loading pokemon #${elementId}`)
          if (mapPokemonData[elementId].hasOwnProperty("jsonData")) {
            console.log(`pokemon #${elementId} has already fetched data.`);
            // load to ui
          }
          else {
            fetch(mapPokemonData[elementId].apiUrl, requestOptions)
              .then((response) => response.text())
              .then((result) => {
                console.log("Before parsing.");
                let pokemonData = JSON.parse(result);
                mapPokemonData[elementId].jsonData = pokemonData;
                loadingPokemon = false;
                // load to ui
              })
              .catch((error) => {
                console.error(error);
                loadingPokemon = false;
              });
          }
        }
        else {
          console.log(`Currently loading pokemon #${elementId}`)
        }
      })

      // append break after each pokemon
      divElement.append(document.createElement('br'));
    }
  })
  .catch((error) => console.error(error));