const levenshtein = require('js-levenshtein');

// example using levenshtein distance
const string1 = "Dungeon ni deai o motomeru no wa machigatteiru darō ka";
const string2 = "Dungeon no dai o motameru no wa machigatteiru darō ka";
const distance = levenshtein(string1, string2);
console.log(distance);

// transform the levenshtein distance to a percentage
// the percentage is the total length of both strings minus the distance divided by the total length of both strings
const percentage = (1 - (distance / (string1.length + string2.length))) * 100;
console.log(percentage);