const requestOptions = {
  method: "GET",
  redirect: "follow"
};

let loadingPokemon = false;

let data;

let mapPokemonData = new Map();

// HTML elements
const divPokemonList                        = document.getElementById("pokemon-list");
const trTypes                               = document.getElementById("types")
const trHeight                              = document.getElementById("height");
const trWeight                              = document.getElementById("weight");
const figPokemonStats                       = document.getElementById("pokemon-stats");
const figPokemonPicture_back_default        = document.getElementById("back_default");
const figPokemonPicture_back_female         = document.getElementById("back_female");
const figPokemonPicture_back_shiny          = document.getElementById("back_shiny");
const figPokemonPicture_back_shiny_female   = document.getElementById("back_shiny_female");
const figPokemonPicture_front_default       = document.getElementById("front_default");
const figPokemonPicture_front_female        = document.getElementById("front_female");
const figPokemonPicture_front_shiny         = document.getElementById("front_shiny");
const figPokemonPicture_front_shiny_female  = document.getElementById("front_shiny_female");

fetch("https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0", requestOptions)
  .then((response) => response.text())
  .then((result) => {
    data = JSON.parse(result);
    console.log(data.results.length);
    for (let i = 0; i < data.results.length; i++) {
      //console.log(`${data.results.name}`);
      const currentPokemonNode = document.createElement('a');
      currentPokemonNode.textContent = `#${String(i + 1).padStart(4, '0')} \t ${data.results[i].name}`;
      currentPokemonNode.id = `${data.results[i].name}`;
      divPokemonList.appendChild(currentPokemonNode);

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
      divPokemonList.append(document.createElement('br'));
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

    // update pictures
    UpdatePokemonFigure(figPokemonPicture_back_default, jsonData);
    UpdatePokemonFigure(figPokemonPicture_back_female, jsonData);
    UpdatePokemonFigure(figPokemonPicture_back_shiny, jsonData);
    UpdatePokemonFigure(figPokemonPicture_back_shiny_female, jsonData);
    UpdatePokemonFigure(figPokemonPicture_front_default, jsonData);
    UpdatePokemonFigure(figPokemonPicture_front_female, jsonData);
    UpdatePokemonFigure(figPokemonPicture_front_shiny, jsonData);
    UpdatePokemonFigure(figPokemonPicture_front_shiny_female, jsonData);
    
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
    trTypes.lastElementChild.innerHTML = displayStringTypes;

    // update height and weight
    trHeight.lastElementChild.innerHTML = jsonData.height;
    trWeight.lastElementChild.innerHTML = jsonData.weight;
    
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
    figPokemonStats.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
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