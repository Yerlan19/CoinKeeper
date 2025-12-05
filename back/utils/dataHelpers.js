// utils/dataHelpers.js
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data');

function ensureDataDirectory() {
  if (!fs.existsSync(dataPath)) {
    fs.mkdirSync(dataPath);
  }
}

function readData(fileName) {
  ensureDataDirectory();
  try {
    const filePath = path.join(dataPath, fileName);
    if (!fs.existsSync(filePath)) {
      return null;
    }
    const data = fs.readFileSync(filePath, 'utf8');
    const parsedJson = JSON.parse(data);
    //console.log(parsedJson);
    return parsedJson;
  } catch (err) {
    console.error(`Error reading ${fileName}:`, err);
    return [];
  }
}

function writeData(fileName, data) {
  ensureDataDirectory();
  try {
    const filePath = path.join(dataPath, fileName);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error(`Error writing ${fileName}:`, err);
  }
}

module.exports = { readData, writeData };