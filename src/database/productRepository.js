const fs = require("fs");
const { data: products } = require("./products.json");
const { dataFilePath } = require("../constants/constants");

function getAll(params) {
  try {
    const { page, limit, sort } = params;
    let sortedProducts = [...products];

    if (sort === "asc") {
      sortedProducts.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
    } else if (sort === "desc") {
      sortedProducts.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    }

    let paginatedProducts = sortedProducts;

    if (limit) {
      const endIndex = 0 + limit;
      paginatedProducts = sortedProducts.slice(0, endIndex);
    }

    if (page && limit) {
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      paginatedProducts = sortedProducts.slice(startIndex, endIndex);
    }

    return paginatedProducts;
  } catch (error) {
    throw new Error(`Error fetching all products: ${error.message}`);
  }
}

function getOne(id, fields) {
  try {
    const product = products.find((product) => product.id === parseInt(id));

    if (!product) {
      throw new Error("Not found product with id: ", id);
    }
    if (fields) {
      const fieldsArr = fields.split(",");
      if (fieldsArr && Array.isArray(fieldsArr) && fieldsArr.length > 0) {
        const filteredProduct = {};
        fieldsArr.forEach((field) => {
          if (product.hasOwnProperty(field)) {
            filteredProduct[field] = product[field];
          }
        });
        return filteredProduct;
      }
    }

    return product;
  } catch (error) {
    throw new Error(`Error fetching a product: ${error.message}`);
  }
}

function add(data) {
  try {
    const existingProduct = products.find(
      (product) => product.id === parseInt(data.id)
    );
    if (existingProduct) {
      throw new Error("Product already exist");
    }
    const updatedProducts = [data, ...products];
    fs.writeFileSync(
      dataFilePath,
      JSON.stringify({
        data: updatedProducts,
      })
    );
  } catch (error) {
    throw new Error(`Error updating product: ${error.message}`);
  }
}

function update(id, updatedProduct) {
  try {
    const index = products.findIndex((product) => product.id === parseInt(id));
    if (index !== -1) {
      products[index] = updatedProduct;
      fs.writeFileSync(dataFilePath, JSON.stringify({ data: products }));
    }
  } catch (error) {
    throw new Error(`Error updating product: ${error.message}`);
  }
}

function remove(id) {
  try {
    const existingProduct = products.find(
      (product) => product.id === parseInt(id)
    );
    if (!existingProduct) {
      throw new Error("Product Not Found with that id!");
    }
    let newProducts = products.filter((product) => product.id !== parseInt(id));
    fs.writeFileSync(dataFilePath, JSON.stringify({ data: newProducts }));
  } catch (error) {
    throw new Error(`Error removing product: ${error.message}`);
  }
}

module.exports = {
  getOne,
  getAll,
  add,
  update,
  remove,
};
