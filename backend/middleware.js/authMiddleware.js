const jwt = require("jsonwebtoken");

const SECRET_KEY = "Clave secreta";

module.exports = function (req, res, next) {
    const header = req.headers["access-token"];

    if (!header) {
        return res.status(401).json({ error: "Token no enviado" });
    }

    const token = header.split(" ")[1];

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded; 
        next();
    } catch (err) {
        return res.status(401).json({ error: "Token inválido o expirado" });
    }
};