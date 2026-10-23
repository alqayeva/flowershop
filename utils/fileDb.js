const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname,"..", "products.json");


function readProducts() {
  try {
    const data = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Searching file:", DATA_FILE);
    console.error("Error", err.message);
    return [];
  }
}

function writeProducts(products) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2));
}

module.exports = { readProducts, writeProducts };