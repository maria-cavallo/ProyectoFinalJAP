const express = require('express');
const router = express.Router();
const api = require('../controllers/apiController');

router.get('/testaccounts', api.getTestAccounts);
router.get('/cats/cat.json', api.getCat);
router.get('/sell/publish.json', api.publishSell);
router.get('/cart/buy.json', api.buyCart);
router.get('/cats_products/:catId.json', api.getCatsProducts);
router.get('/products/:productId.json', api.getProduct);
router.get('/products_comments/:productId.json', api.getProductComments);
router.get('/user_cart/:userId.json', api.getUserCart);

module.exports = router;
