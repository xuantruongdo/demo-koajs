const fs = require("fs");
const { data: products } = require("./products.json");
const { dataFilePath } = require("../constants/constants");
const { sortByProperty } = require("../helpers/sort");
const { filterObjectFields } = require("../helpers/filterFields");

function getAll({ limit = 10, sort = "asc" } = {}) {
  let sortedProducts = sortByProperty(products, "createdAt", sort);
  const paginatedProducts = sortedProducts.slice(0, limit);
  return paginatedProducts;
}

function getOne(id, fields) {
  const product = products.find((product) => product.id === id);
  if (product) {
    if (fields) {
      return filterObjectFields(product, fields);
    }
    return product;
  } else {
    throw new Error("Product Not Found with that id!");
  }
}

function add(data) {
  const updatedProducts = [data, ...products];
  fs.writeFileSync(
    dataFilePath,
    JSON.stringify({
      data: updatedProducts,
    })
  );
}

function update(id, updatedProduct) {
  const index = products.findIndex((product) => product.id === id);
  if (index !== -1) {
    products[index] = updatedProduct;
    fs.writeFileSync(dataFilePath, JSON.stringify({ data: products }));
  }
}

function remove(id) {
  const newProducts = products.filter((product) => product.id !== id);
  fs.writeFileSync(dataFilePath, JSON.stringify({ data: newProducts }));
}

module.exports = {
  getOne,
  getAll,
  add,
  update,
  remove,
};
