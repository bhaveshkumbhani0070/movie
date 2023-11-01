const { pool } = require('../db');

class User {
    static async create(email, password, username) {
        const query = 'INSERT INTO users (email, password,username) VALUES ($1, $2,$3) RETURNING *';
        const values = [email, password, username];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async findByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = $1';
        const values = [email];
        const result = await pool.query(query, values);
        return result.rows[0];
    }
}

module.exports = User;
