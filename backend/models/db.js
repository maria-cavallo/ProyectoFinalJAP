const mariadb = require('mariadb');

const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: 'a25g28v31c08',
    database: 'proyectojap',
    connectionLimit: 5
});

async function query(sql, params = []) {
    let conn;
    try {
        conn = await pool.getConnection();
        return await conn.query(sql, params);
    } catch (err) {
        console.error("DB ERROR:", err);
        throw err;
    } finally {
        if (conn) conn.release();
    }
}

module.exports = { query };
