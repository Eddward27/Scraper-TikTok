var mysql = require('mysql');

const config = {
    host: 'localhost',
    user: 'tiktok',
    password: 'scraptiktok',
    database: 'TikTok',
};

const pool = mysql.createPool(config);

module.exports = pool;
