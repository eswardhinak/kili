'use strict'
const fs = require('fs');AbortController
let rawdata = fs.readFileSync('tamil1.json');
let tamilwords = JSON.parse(rawdata);

let tamilDict = {};
tamilwords.forEach((word, i) => {
  tamilDict[word["englishmeaning"].toLowerCase()] = {"tamil": word["tamilword"], "pronounciation": word["pronounce"]}
})

console.log(tamilDict);

let outputData = JSON.stringify(tamilDict);
fs.writeFileSync('tamil2.json', outputData);