const path = require('path');
const fs = require('fs');
const fetch = require('node-fetch');

const dataDir = path.join(__dirname, '..', 'data');

async function serveOrProxy(res, localPathSegments, upstreamUrl) {
    const localPath = path.join(dataDir, ...localPathSegments);

    if (fs.existsSync(localPath)) {
        return res.sendFile(localPath);
    }

    try {
        const upstreamRes = await fetch(upstreamUrl);

        if (!upstreamRes.ok) {
            return res.status(502).json({ error: 'Upstream error' });
        }

        const body = await upstreamRes.text();
        res.set('Content-Type', upstreamRes.headers.get('content-type') || 'application/json');
        return res.send(body);

    } catch (err) {
        console.error('Proxy error', err);
        return res.status(500).json({ error: 'Proxy failure' });
    }
}

module.exports = { serveOrProxy, dataDir };
