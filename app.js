const express = require('express');
const path = require('path');

const booksRoutes = require('./routes/booksRoutes');
const membersRoutes = require('./routes/membersRoutes');
const loansRoutes = require('./routes/loansRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const authorsRoutes = require('./routes/authorsRoutes');

const logger = require('./middleware/logger');
const validation = require('./middleware/validation');
const errorHandler = require('./middleware/errorHandler');


const app = express();


// ============================================
// MIDDLEWARES GÉNÉRAUX
// ============================================

app.use(express.json());

app.use(express.static(path.join(__dirname, 'frontend')));

app.use(logger);
app.use(validation);


// ============================================
// ROUTES ORGANISÉES
// ============================================

app.use('/authors', authorsRoutes);
app.use('/books', booksRoutes);
app.use('/members', membersRoutes);
app.use('/loans', loansRoutes);
app.use('/dashboard', dashboardRoutes);


// ============================================
// GESTION DES ERREURS
// ============================================

app.use(errorHandler);


// ============================================
// EXPORT
// ============================================

module.exports = { app };