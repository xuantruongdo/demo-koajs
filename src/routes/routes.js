const Router = require('koa-router');
const bookHandler = require('../handlers/books/bookHandlers');
const productHandlers = require('../handlers/products/productHandlers');
const bookInputMiddleware = require('../middleware/bookInputMiddleware');
const productInputMiddleware = require('../middleware/productInputMiddleware');
const productUpdateInputMiddleware = require('../middleware/productUpdateInputMiddleware');
const { getAll: getAllProducts, getOne: getOneProduct } = require('../database/productRepository');

// Prefix all routes with /books
const router = new Router();

// Frontend
router.get('/products', async function (ctx) {
  const products = getAllProducts();
  await ctx.render('pages/product', {products});
});

router.get('/create', async function (ctx) {
  await ctx.render('pages/create');
});

router.get('/update/:id', async function (ctx) {
  const productId = parseInt(ctx.params.id);
  const product = getOneProduct(productId);
  await ctx.render('pages/update', { productEdit: product });
});

// API
// books
router.get('/api/books', bookHandler.getBooks);
router.get('/api/books/:id', bookHandler.getBook);  
router.post('/api/books', bookInputMiddleware, bookHandler.save);

// products
router.get('/api/products', productHandlers.getProducts);
router.get('/api/products/:id', productHandlers.getProduct);
router.post('/api/products', productInputMiddleware, productHandlers.save);
router.post('/api/generate', productHandlers.generate);
router.put('/api/products/:id', productUpdateInputMiddleware, productHandlers.updateProduct);
router.delete('/api/products/:id', productHandlers.removeProduct);

module.exports = router;
