//import generateName from "sillyname"; // ES6 import syntax

//var sillyname = generateName();

//console.log(`My name is ${sillyname}.`); 

import superheroes from "superheroes"; // ES6 import syntax

// Generate a random superhero name
const randomName = superheroes[Math.floor(Math.random() * superheroes.length)];

// Output the random name
console.log(`My name is ${randomName}.`);