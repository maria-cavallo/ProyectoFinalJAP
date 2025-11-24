const path = require('path');
const fs = require('fs');
const { serveOrProxy, dataDir } = require('../models/proxyModel');

exports.getTestAccounts = (req, res) => {
    const file = path.join(dataDir, 'testaccounts.json');
    if (fs.existsSync(file)) return res.sendFile(file);
    return res.status(404).json({ error: 'Not found' });
};

exports.getCat = (req, res) => {
    const upstream = 'https://japceibal.github.io/emercado-api/cats/cat.json';
    return serveOrProxy(res, ['cats', 'cat.json'], upstream);
};

exports.publishSell = (req, res) => {
    const upstream = 'https://japceibal.github.io/emercado-api/sell/publish.json';
    return serveOrProxy(res, ['sell', 'publish.json'], upstream);
};

exports.buyCart = (req, res) => {
    const upstream = 'https://japceibal.github.io/emercado-api/cart/buy.json';
    return serveOrProxy(res, ['cart', 'buy.json'], upstream);
};

exports.getCatsProducts = (req, res) => {
    const catId = req.params.catId;
    const upstream = `https://japceibal.github.io/emercado-api/cats_products/${catId}.json`;
    return serveOrProxy(res, ['cats_products', `${catId}.json`], upstream);
};

exports.getProduct = (req, res) => {
    const id = req.params.productId;
    const upstream = `https://japceibal.github.io/emercado-api/products/${id}.json`;
    return serveOrProxy(res, ['products', `${id}.json`], upstream);
};

exports.getProductComments = (req, res) => {
    const id = req.params.productId;
    const upstream = `https://japceibal.github.io/emercado-api/products_comments/${id}.json`;
    return serveOrProxy(res, ['products_comments', `${id}.json`], upstream);
};

exports.getUserCart = (req, res) => {
    const id = req.params.userId;
    const upstream = `https://japceibal.github.io/emercado-api/user_cart/${id}.json`;
    return serveOrProxy(res, ['user_cart', `${id}.json`], upstream);
};
