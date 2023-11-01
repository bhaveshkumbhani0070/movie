const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const jwt = require('jsonwebtoken');

const authRoutes = require('./routes/auth');
const movieRoutes = require('./routes/movie');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    jwt.verify(token, 'secretkey', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Failed to authenticate token' });
        }

        req.userId = decoded.userId;
        next();
    });
};

// Use the routes
app.use('/auth', authRoutes);
app.use('/movies', verifyToken, movieRoutes);

app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running on port ' + process.env.PORT || 3000);
});
