const fs = require('fs');
const { data: products } = require('./products.json');
const { dataFilePath } = require('../constants/constants');

function getAll(page, limit, sort) {
    let paginatedProducts = [...products]
    if (limit) {
        const endIndex = 0 + limit;
        paginatedProducts = products.slice(0, endIndex);
    }
    if (page && limit) {
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        paginatedProducts = products.slice(startIndex, endIndex);
    }
    if (sort == 'asc') {
        paginatedProducts.sort(function (a, b) {
            return new Date(a.createdAt) - new Date(b.createdAt);
        })
    }
    else if (sort == 'desc') {
        paginatedProducts.sort(function (a, b) {
            return new Date(b.createdAt) - new Date(a.createdAt);
        })
    }
    
    return paginatedProducts;
}
  
function getOne(id, fields) {
    const product = products.find(product => product.id === parseInt(id));

    if (fields) {
        const fieldsArr = fields.split(",")
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
}

function add(data) {
    const existingProduct = products.find(product => product.id === parseInt(data.id));
    if (existingProduct) {
        throw new Error('Product already exist');
    }
    const updatedProducts = [data, ...products];
    fs.writeFileSync(dataFilePath, JSON.stringify({
        data: updatedProducts
    }));
}

function update(id, updatedProduct) {
    try {
        const index = products.findIndex(product => product.id === parseInt(id));
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
        const existingProduct = products.find(product => product.id === parseInt(id));
        if (!existingProduct) {
            throw new Error('Product Not Found with that id!');
        }
        let newProducts = products.filter(product => product.id !== parseInt(id));
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
    remove
};
  