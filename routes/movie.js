const express = require('express');
const router = express.Router();
const Movie = require('../models/movie');

// Get all movies
router.get('/', async (req, res) => {
    try {
        const userId = req.userId;
        const movies = await Movie.getAll(userId);
        res.status(200).json(movies);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Add a movie
router.post('/', async (req, res) => {
    const userId = req.userId;
    let { movie_name, rating, movie_cast, genre, release_date } = req.body;
    movie_cast = movie_cast.split(',')
    console.log('movie_cast', movie_cast)
    try {
        const newMovie = await Movie.create(userId, movie_name, rating, movie_cast, genre, release_date);
        res.status(201).json(newMovie);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Update a movie
router.put('/:id', async (req, res) => {
    const userId = req.userId;
    let { movie_name, rating, movie_cast, genre, release_date } = req.body;
    const { id } = req.params;
    movie_cast = movie_cast.split(',')
    try {
        const updatedMovie = await Movie.update(userId, id, movie_name, rating, movie_cast, genre, release_date);
        res.status(200).json(updatedMovie);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Delete a movie
router.delete('/:id', async (req, res) => {
    const userId = req.userId;
    const { id } = req.params;

    try {
        await Movie.delete(userId, id);
        res.status(200).json({ message: 'Movie deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
