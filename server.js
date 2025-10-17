// server.js
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());            // allow frontend to call backend
app.use(express.json());    // parse JSON bodies

// ---- Fake data stores (in-memory) ----
let movies = [
  { id: 1, title: 'Inception', year: 2010, poster_path: '' },
  { id: 2, title: 'Interstellar', year: 2014, poster_path: '' }
];

let favorites = []; // saved favorite movies

// ---- Routes ----
app.get('/', (req, res) => res.send('Movie Backend is up'));

// Get all movies (temporary)
app.get('/movies', (req, res) => {
  res.json(movies);
});

// Add movie to "movies" (not needed for favorites flow, but available)
app.post('/movies', (req, res) => {
  const newMovie = req.body;
  movies.push(newMovie);
  res.status(201).json(newMovie);
});

// Get all favorites
app.get('/favorites', (req, res) => {
  res.json(favorites);
});

// Add a new favorite
app.post('/favorites', (req, res) => {
  const movie = req.body;
  // simple check to avoid duplicates by movie id
  const exists = favorites.find(f => f.id === movie.id);
  if (exists) {
    return res.status(200).json({ message: 'Already favorited', favorite: exists });
  }
  favorites.push(movie);
  res.status(201).json({ message: 'Favorited', favorite: movie });
});

// Remove favorite by id
app.delete('/favorites/:id', (req, res) => {
  const id = Number(req.params.id);
  const before = favorites.length;
  favorites = favorites.filter(f => f.id !== id);
  if (favorites.length === before) {
    return res.status(404).json({ message: 'Favorite not found' });
  }
  res.json({ message: 'Removed' });
});

// Start server
app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
