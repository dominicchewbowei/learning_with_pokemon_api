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
            UpdatePokemonData(elementId);
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
                UpdatePokemonData(elementId);
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


const UpdatePokemonData = (pokemonName) => {
  if (!pokemonName.length)
  {
  }
  else if (!mapPokemonData[pokemonName].hasOwnProperty("jsonData"))
  {
    console.log(`pokemon ${pokemonName} data is not ready`);
  }
  else
  {
    // update name
    const jsonData = mapPokemonData[pokemonName].jsonData;

    document.getElementById("pokemon-name").innerHTML = jsonData.name;

    const pokemonStats = document.getElementById("pokemon-stats");
    const pokemonPicture_back_default = document.getElementById("back_default");
    const pokemonPicture_back_female = document.getElementById("back_female");
    const pokemonPicture_back_shiny = document.getElementById("back_shiny");
    const pokemonPicture_back_shiny_female = document.getElementById("back_shiny_female");
    const pokemonPicture_front_default = document.getElementById("front_default");
    const pokemonPicture_front_female = document.getElementById("front_female");
    const pokemonPicture_front_shiny = document.getElementById("front_shiny");
    const pokemonPicture_front_shiny_female = document.getElementById("front_shiny_female");
    // update pictures
    UpdatePokemonFigure(pokemonPicture_back_default, jsonData);
    UpdatePokemonFigure(pokemonPicture_back_female, jsonData);
    UpdatePokemonFigure(pokemonPicture_back_shiny, jsonData);
    UpdatePokemonFigure(pokemonPicture_back_shiny_female, jsonData);
    UpdatePokemonFigure(pokemonPicture_front_default, jsonData);
    UpdatePokemonFigure(pokemonPicture_front_female, jsonData);
    UpdatePokemonFigure(pokemonPicture_front_shiny, jsonData);
    UpdatePokemonFigure(pokemonPicture_front_shiny_female, jsonData);
    
    // update type
    let numberOfTypes = jsonData.types.length;
    let displayStringTypes  = "";
    if (numberOfTypes > 1)
    {
      displayStringTypes = "Types:";
    }
    else
    {
      displayStringTypes = "Type: ";
    }
    for (let i = 0; i < numberOfTypes; i++)
    {
      if (i > 0)
      {
        displayStringTypes += '\\';
      }
      displayStringTypes += jsonData.types[i].type.name;
    }
    document.getElementById("types").lastElementChild.innerHTML = displayStringTypes;

    // update height and weight
    document.getElementById("height").lastElementChild.innerHTML = jsonData.height;
    document.getElementById("weight").lastElementChild.innerHTML = jsonData.weight;
    
    // update base stats
    for (let i = 0; i < jsonData.stats.length; i++)
    {
      let statsName = jsonData.stats[i].stat.name;
      document.getElementById(statsName).lastElementChild.innerHTML = jsonData.stats[i].base_stat;
    }
    
    // remove all active elements
    const activeElementsBySelectorAll = document.querySelectorAll('li.active');
    activeElementsBySelectorAll.forEach(element => {
      element.classList.remove("active");
    });
    document.getElementById(pokemonName).className += "active";
  }
}

  const UpdatePokemonFigure = (figureNode, jsonData) => {
    let imageUrl = jsonData.sprites[figureNode.id];
    figureNode.firstElementChild.src = imageUrl;
    //const imgNode = figureNode.getElementsByTagName("img")[0];
    //figureNode.getElementsByTagName("img")[0].src = imageUrl;
    //imgNode.src = imageUrl;
    if (imageUrl && imageUrl.length)
    {
      figureNode.classList.remove("hidden");
    }
    else
    {
      figureNode.classList.add("hidden");
    }
  }