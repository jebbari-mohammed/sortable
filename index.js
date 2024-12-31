// This function is called only after the data has been fetched, and parsed.
const loadData = (heroes) => {
  console.log(heroes);
};
// Request the file with fetch, and the data will be downloaded to your browser cache.
fetch("https://rawcdn.githack.com/akabab/superhero-api/0.2.0/api/all.json")
  .then((response) => response.json()) // parse the response from JSON
  .then(loadData); // .then will call the `loadData` function with the JSON value.
