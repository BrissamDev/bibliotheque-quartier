const express = require('express');

const router = express.Router();

const {
  getBooks,
  createBook,
  updateBook,
  deleteBook,
  searchBooks,
  getBooksPage
} = require('../controllers/booksController');


// Attention : search et page avant :id
router.get('/search', searchBooks);
router.get('/page', getBooksPage);

router.get('/', getBooks);
router.post('/', createBook);
router.put('/:id', updateBook);
router.delete('/:id', deleteBook);

module.exports = router;