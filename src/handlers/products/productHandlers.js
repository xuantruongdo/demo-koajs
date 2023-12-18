const {
  getAll: getAllProducts,
  getOne: getOneProduct,
  add: addProduct,
  update,
  remove,
} = require("../../database/productRepository");
const fs = require("fs");
const { dataFilePath } = require("../../constants/constants");
const { generateFakeProducts } = require("../../helpers/faker");
const { v4: uuidv4 } = require("uuid");

async function getProducts(ctx) {
  try {
    const products = getAllProducts(ctx.query);

    ctx.body = {
      data: products,
    };
  } catch (e) {
    ctx.status = 404;
    ctx.body = {
      success: false,
      data: [],
      error: e.message,
    };
  }
}

async function getProduct(ctx) {
  try {
    const { id } = ctx.params;
    const fields = ctx.query.fields;
    const currentProduct = getOneProduct(id, fields);
    if (currentProduct) {
      return (ctx.body = {
        data: currentProduct,
      });
    }
  } catch (e) {
    ctx.status = 404;
    return (ctx.body = {
      success: false,
      error: e.message,
    });
  }
}

async function save(ctx) {
  try {
    const postData = ctx.request.body;
    postData.id = uuidv4();
    postData.createdAt = new Date().toISOString();
    addProduct(postData);

    ctx.status = 201;
    return (ctx.body = {
      success: true,
    });
  } catch (e) {
    return (ctx.body = {
      success: false,
      error: e.message,
    });
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
        ...updateData,
      };

      update(id, updatedProduct);

      ctx.status = 200;
      return (ctx.body = {
        success: true,
      });
    } else {
      throw new Error("Product Not Found with that id!");
    }
  } catch (e) {
    ctx.status = 404;
    return (ctx.body = {
      success: false,
      error: e.message,
    });
  }
}

async function removeProduct(ctx) {
  try {
    const { id } = ctx.params;
    const currentProduct = getOneProduct(id);
    if (currentProduct) {
      remove(id);
    } else {
      throw new Error("Product Not Found with that id!");
    }

    ctx.status = 201;
    return (ctx.body = {
      success: true,
    });
  } catch (e) {
    ctx.status = 404;
    return (ctx.body = {
      success: false,
      error: e.message,
    });
  }
}

async function generate(ctx) {
  try {
    const products = generateFakeProducts(1000);

    fs.writeFileSync(
      dataFilePath,
      JSON.stringify({
        data: products,
      })
    );

    ctx.status = 201;
    return (ctx.body = {
      success: true,
    });
  } catch (e) {
    return (ctx.body = {
      success: false,
      error: e.message,
    });
  }
}

module.exports = {
  getProducts,
  getProduct,
  save,
  updateProduct,
  removeProduct,
  generate,
};
