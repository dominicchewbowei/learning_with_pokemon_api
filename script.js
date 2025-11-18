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
        for (let i = 0; i < data.results.length; i++)     // print 10 first

        {
            console.log(`${data.results.name}`);
            document.getElementById("pokemon-list").innerHTML += 
                `#${i} \t ${data.results[i].name}<br>`;
        }
  })
  .catch((error) => console.error(error));