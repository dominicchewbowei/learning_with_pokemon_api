const requestOptions = {
  method: "GET",
  redirect: "follow"
};

let data;

fetch("https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0", requestOptions)
  .then((response) => response.text())
  .then((result) => {
        data = JSON.parse(result);
        console.log(data.results.length);
        const divElement = document.getElementById("pokemon-list");
        for (let i = 0; i < data.results.length; i++)
        {
            console.log(`${data.results.name}`);
            const currentPokemonNode = document.createElement('a');
            currentPokemonNode.textContent =`#${String(i+1).padStart(4, '0')} \t ${data.results[i].name}`;
            currentPokemonNode.id = `${data.results[i].name}`;
            divElement.appendChild(currentPokemonNode);
            divElement.append(document.createElement('br'));
        }
  })
  .catch((error) => console.error(error));