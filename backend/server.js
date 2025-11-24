const express = require('express');
const path = require('path');
const fs = require('fs');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

const dataDir = path.join(__dirname, 'data');

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

async function serveOrProxy(res, localPathSegments, upstreamUrl) {
  const localPath = path.join(dataDir, ...localPathSegments);
  if (fs.existsSync(localPath)) {
    return res.sendFile(localPath);
  }
  try {
    const upstreamRes = await fetch(upstreamUrl);
    if (!upstreamRes.ok) return res.status(502).json({ error: 'Upstream error' });
    const body = await upstreamRes.text();
    res.set('Content-Type', upstreamRes.headers.get('content-type') || 'application/json');
    return res.send(body);
  } catch (err) {
    console.error('Proxy error', err);
    return res.status(500).json({ error: 'Proxy failure' });
  }
}

app.get('/api/testaccounts', (req, res) => {
  const file = path.join(dataDir, 'testaccounts.json');
  if (fs.existsSync(file)) return res.sendFile(file);
  return res.status(404).json({ error: 'Not found' });
});

app.get('/api/cats/cat.json', (req, res) => {
  const upstream = 'https://japceibal.github.io/emercado-api/cats/cat.json';
  return serveOrProxy(res, ['cats', 'cat.json'], upstream);
});

app.get('/api/sell/publish.json', (req, res) => {
  const upstream = 'https://japceibal.github.io/emercado-api/sell/publish.json';
  return serveOrProxy(res, ['sell', 'publish.json'], upstream);
});

app.get('/api/cart/buy.json', (req, res) => {
  const upstream = 'https://japceibal.github.io/emercado-api/cart/buy.json';
  return serveOrProxy(res, ['cart', 'buy.json'], upstream);
});

app.get('/api/cats_products/:catId.json', (req, res) => {
  const catId = req.params.catId;
  const upstream = `https://japceibal.github.io/emercado-api/cats_products/${catId}.json`;
  return serveOrProxy(res, ['cats_products', `${catId}.json`], upstream);
});

app.get('/api/products/:productId.json', (req, res) => {
  const id = req.params.productId;
  const upstream = `https://japceibal.github.io/emercado-api/products/${id}.json`;
  return serveOrProxy(res, ['products', `${id}.json`], upstream);
});

app.get('/api/products_comments/:productId.json', (req, res) => {
  const id = req.params.productId;
  const upstream = `https://japceibal.github.io/emercado-api/products_comments/${id}.json`;
  return serveOrProxy(res, ['products_comments', `${id}.json`], upstream);
});

app.get('/api/user_cart/:userId.json', (req, res) => {
  const id = req.params.userId;
  const upstream = `https://japceibal.github.io/emercado-api/user_cart/${id}.json`;
  return serveOrProxy(res, ['user_cart', `${id}.json`], upstream);
});

app.get('/', (req, res) => {
  res.json({ message: 'emercado local API: /api/testaccounts, /api/..., proxying remote when data not local' });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
