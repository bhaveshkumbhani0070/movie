import { Pool } from 'pg';

const pool = new Pool({
    user: 'gvuxuaqw',
    host: 'cornelius.db.elephantsql.com',
    database: 'gvuxuaqw',
    password: '2xjLQqBa0enpn_cEFC_aZ9eAaygL5XqN',
    port: 5432,
});

const db = {
    async connect() {
        try {
            await pool.connect();
            console.log('Connected to PostgreSQL database!');
        } catch (error) {
            console.error('Error connecting to PostgreSQL database:', error);
        }
    },
    async query(query) {
        try {
            console.log('query', query)
            await pool.query(query);
            console.log('Connected to PostgreSQL database!');
        } catch (error) {
            console.error('Error connecting to PostgreSQL database:', error);
        }
    },
    async disconnect() {
        try {
            await pool.end();
            console.log('Disconnected from PostgreSQL database!');
        } catch (error) {
            console.error('Error disconnecting from PostgreSQL database:', error);
        }
    },
};

export default pool;
