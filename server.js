const express = require('express');
const app = express();
const { animals } = require('./data/animals');

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
  }

  if (query.diet) {
    filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
  }
  if (query.species) {
    filteredResults = filteredResults.filter(animal => animal.species === query.species);
  }
  if (query.name) {
    filteredResults = filteredResults.filter(animal => animal.name === query.name);
  }
  // return filtered results
  return filteredResults;
};

app.get("/api/animals", (req, res) => {
  let results = animals;
  if (req.query) {
    results = filterByQuery(req.query, results);
  }
  res.json(results);
});

app.listen(3001, () => {
  console.log(
    `API server now on port 3001 at http://localhost:3001/api/animals`
  );
});