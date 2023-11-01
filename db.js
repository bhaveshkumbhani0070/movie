const { Pool } = require('pg');
const pool = new Pool({
    user: 'gvuxuaqw',
    host: 'cornelius.db.elephantsql.com',
    database: 'gvuxuaqw',
    password: '2xjLQqBa0enpn_cEFC_aZ9eAaygL5XqN',
    port: 5432,
});
module.exports = { pool };
