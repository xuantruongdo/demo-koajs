const {getAll: getAllProducts, getOne: getOneProduct, add: addProduct, update, remove} = require("../../database/productRepository");
const fs = require('fs');
const { dataFilePath } = require("../../constants/constants");
const { generateFakeProducts } = require("../../helpers/helper");

async function getProducts(ctx) {
  try {
    const page = parseInt(ctx.query.page);
    const limit = parseInt(ctx.query.limit);
    const sort = ctx.query.sort;
    const products = getAllProducts(page, limit, sort);
    
    ctx.body = {
      data: products
    };
  } catch (e) {
    ctx.status = 404;
    ctx.body = {
      success: false,
      data: [],
      error: e.message
    };
  }
}

async function getProduct(ctx) {
  try {
    const { id } = ctx.params;
    const fields = ctx.query.fields;
    const getCurrentProduct = getOneProduct(id, fields);
    if (getCurrentProduct) {
      return ctx.body = {
        data: getCurrentProduct
      }
    }

    throw new Error('Product Not Found with that id!')
  } catch (e) {
    ctx.status = 404;
    return ctx.body = {
      success: false,
      error: e.message
    }
  }
}

async function save(ctx) {
  try {
      const postData = ctx.request.body;
      postData.id = parseInt(postData.id)
      postData.createdAt = new Date().toISOString();
      addProduct(postData);

      ctx.status = 201;
      return ctx.body = {
          success: true
      }
  } catch (e) {
      return ctx.body = {
          success: false,
          error: e.message
      }
  }
}

async function updateProduct(ctx) {
  try {
    const { id } = ctx.params;
    const updateData = ctx.request.body;
    const currentProduct = getOneProduct(id);
    if (currentProduct) {
      const updatedProduct = {
        ...currentProduct,
        ...updateData
      };

      update(id, updatedProduct);

      ctx.status = 200;
      return ctx.body = {
        success: true,
      };
    } else {
      throw new Error('Product Not Found with that id!');
    }

    
  } catch (e) {
    ctx.status = 404;
    return ctx.body = {
      success: false,
      error: e.message
    };
  }
}

async function removeProduct(ctx) {
  try {
    const { id } = ctx.params;
    remove(id);

    ctx.status = 201;
    return ctx.body = {
        success: true
    }

  } catch (e) {
    ctx.status = 404;
      return ctx.body = {
          success: false,
          error: e.message
      }
  }
}

async function generate(ctx) {
  try {
    const products = generateFakeProducts(1000);
    
    fs.writeFileSync(dataFilePath, JSON.stringify({
      data: products
    }));

      ctx.status = 201;
      return ctx.body = {
          success: true
      }
  } catch (e) {
      return ctx.body = {
          success: false,
          error: e.message
      }
  }
}

module.exports = {
  getProducts,
  getProduct,
  save,
  updateProduct,
  removeProduct,
  generate
};