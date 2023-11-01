const { pool } = require('../db');

class Movie {
    static async getAll(userId) {
        const query = 'SELECT * FROM movies WHERE user_id = $1';
        const values = [userId];
        const result = await pool.query(query, values);
        return result.rows;
    }

    static async create(userId, movieName, rating, movieCast, genre, releaseDate) {
        const query =
            'INSERT INTO movies (user_id, movie_name, rating, movie_cast, genre, release_date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
        const values = [userId, movieName, rating, movieCast, genre, releaseDate];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async update(userId, id, movieName, rating, movieCast, genre, releaseDate) {
        const query =
            'UPDATE movies SET movie_name = $1, rating = $2, movie_cast = $3, genre = $4, release_date = $5 WHERE id = $6 AND user_id = $7 RETURNING *';
        const values = [movieName, rating, movieCast, genre, releaseDate, id, userId];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async delete(userId, id) {
        const query = 'DELETE FROM movies WHERE id = $1 AND user_id = $2';
        const values = [id, userId];
        await pool.query(query, values);
    }
}

module.exports = Movie;
