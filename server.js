const fs = require('fs');
const path = require('path');
const express = require('express');
const { animals } = require('./data/animals');

const PORT = process.env.PORT || 3001;
const app = express();
// serves static files
app.use(express.static('public'));
// parse incoming string or array data
app.use(express.urlencoded({ extend: true }));
// parse incoming JSON data
app.use(express.json());

function filterByQuery(query, animalsArray) {
let personalityTraitsArray = [];
  let filteredResults = animalsArray;
  if (query.personalityTraits) {
    // if personalityTraits is a string, place in new array and save.
    if (typeof query.personalityTraits === 'string') {
      personalityTraitsArray = [query.personalityTraits];
    } else {
      personalityTraitsArray = query.personalityTraits;
    }
    // loop through each trait in the personalityTraitsArray
    personalityTraitsArray.forEach (trait => {
      // check trait compared to all animals in the array.
      // filtered results will only show animals that contain the trait
      filteredResults = filteredResults.filter(
        animal => animal.personalityTraits.indexOf(trait) !== -1
      );
    });
  };
  if (query.diet) {
    // shows all animals with queried diet
    filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
  };
  if (query.species) {
    // shows all animals with queried species
    filteredResults = filteredResults.filter(animal => animal.species === query.species);
  };
  if (query.name) {
    // shows all animals with queried name
    filteredResults = filteredResults.filter(animal => animal.name === query.name);
  };
  // return filtered results
  return filteredResults;
};

function findById(id, animalsArray) {
  const result = animalsArray.filter(animal => animal.id === id)[0];
  return result;
};

function createNewAnimal(body, animalsArray) {
  const animal = body;
  animalsArray.push(animal);
  fs.writeFileSync(
    path.join(__dirname, './data/animals.json'),
    JSON.stringify({ animals: animalsArray }, null, 2)
  );
  return animal;
};

function validateAnimal(animal) {
  if (!animal.name || typeof animal.name !== "string") {
    return false;
  }
  if (!animal.species || typeof animal.species !== "string") {
    return false;
  }
  if (!animal.diet || typeof animal.diet !== "string") {
    return false;
  };
  if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
    return false;
  };
  return true;
};

app.get("/api/animals", (req, res) => {
  let results = animals;
  if (req.query) {
    results = filterByQuery(req.query, results);
  };
  res.json(results);
});

app.get('/api/animals/:id', (req, res) => {
  const result = findById(req.params.id, animals);
  if (result) {
    // if valid id, show result
    res.json(result);
  } else {
    // if invalid id, show error
    res.send(404);
  };
});

app.post('/api/animals', (req, res) => {
  // set id based on what next index of array will be
  req.body.id = animals.length.toString();

  // if any data is req.body is incorrect, send 400 error back
  if (!validateAnimal(req.body)) {
    res.status(400).send('The animal is not properly formatted.');
  } else {
  const animal = createNewAnimal(req.body, animals); 
  res.json(animal);
  };
});

app.get('/', (req, res) => {
  // sends index.html to be the / page for the site
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get("/animals", (req, res) => {
  // sends animals.html to be the /animals page for the site
  res.sendFile(path.join(__dirname, "./public/animals.html"));
});

app.get("/zookeepers", (req, res) => {
  // sends zookeepers.html to be the /zookeepers page for the site
  res.sendFile(path.join(__dirname, "./public/zookeepers.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.listen(PORT, () => {
  console.log(
    `API server now on port ${PORT} at http://localhost:${PORT}/api/animals`
  );
});