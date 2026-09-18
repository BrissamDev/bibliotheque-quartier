const pool = require('../db');


// GET - récupérer tous les livres
const getBooks = async (req, res, next) => {
    try {
        const result = await pool.query(`
      SELECT
        books.id,
        books.auteur_id,
        CONCAT(authors.prenom, ' ', authors.nom) AS auteur,
        books.titre,
        books.annee,
        books.disponible
      FROM books
      JOIN authors
        ON books.auteur_id = authors.id
      ORDER BY books.id
    `);

        res.send(result.rows);
    } catch (error) {
        next(error);
    }
};


// POST - ajouter un livre
const createBook = async (req, res, next) => {
    try {
        const { auteur_id, titre, annee } = req.body;

        const author = await pool.query(
            'SELECT * FROM authors WHERE id = $1',
            [auteur_id]
        );

        if (author.rows.length === 0) {
            return res.status(404).send({
                message: 'Auteur non trouvé'
            });
        }

        const result = await pool.query(
            `INSERT INTO books (auteur_id, titre, annee)
       VALUES ($1, $2, $3)
       RETURNING *`,
            [auteur_id, titre, annee]
        );

        res.status(201).send(result.rows[0]);
    } catch (error) {
        next(error);
    }
};


// PUT - modifier un livre
const updateBook = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const { auteur_id, titre, annee, disponible } = req.body;


        const author = await pool.query(
            'SELECT * FROM authors WHERE id = $1',
            [auteur_id]
        );

        if (author.rows.length === 0) {
            return res.status(404).send({
                message: 'Auteur non trouvé'
            });
        }


        const result = await pool.query(
            `UPDATE books
       SET auteur_id = $1,
           titre = $2,
           annee = $3,
           disponible = COALESCE($4, disponible)
       WHERE id = $5
       RETURNING *`,
            [auteur_id, titre, annee, disponible, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).send({
                message: 'Livre non trouvé'
            });
        }

        res.send(result.rows[0]);
    } catch (error) {
        next(error);
    }
};


// DELETE - supprimer un livre
const deleteBook = async (req, res, next) => {
    try {
        const id = Number(req.params.id);

        const result = await pool.query(
            `DELETE FROM books
       WHERE id = $1
       RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).send({
                message: 'Livre non trouvé'
            });
        }

        res.send({
            message: 'Livre supprimé avec succès'
        });
    } catch (error) {
        next(error);
    }
};


// GET - rechercher un livre
const searchBooks = async (req, res, next) => {
    try {
        const search = req.query.q;

        if (!search) {
            return res.status(400).send({
                message: 'Veuillez fournir un terme de recherche'
            });
        }

        const result = await pool.query(
            `SELECT
         books.id,
         books.auteur_id,
         CONCAT(authors.prenom, ' ', authors.nom) AS auteur,
         books.titre,
         books.annee,
         books.disponible
       FROM books
       JOIN authors
         ON books.auteur_id = authors.id
       WHERE LOWER(books.titre) LIKE LOWER($1)
          OR LOWER(authors.nom) LIKE LOWER($1)
          OR LOWER(authors.prenom) LIKE LOWER($1)
       ORDER BY books.id`,
            [`%${search}%`]
        );

        res.send(result.rows);
    } catch (error) {
        next(error);
    }
};


// GET - pagination
const getBooksPage = async (req, res, next) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;

        const offset = (page - 1) * limit;

        const result = await pool.query(
            `SELECT
         books.id,
         books.auteur_id,
         CONCAT(authors.prenom, ' ', authors.nom) AS auteur,
         books.titre,
         books.annee,
         books.disponible
       FROM books
       JOIN authors
         ON books.auteur_id = authors.id
       ORDER BY books.id
       LIMIT $1 OFFSET $2`,
            [limit, offset]
        );

        const totalResult = await pool.query(
            'SELECT COUNT(*) FROM books'
        );

        const total = Number(totalResult.rows[0].count);

        res.send({
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            books: result.rows
        });
    } catch (error) {
        next(error);
    }
};


module.exports = {
    getBooks,
    createBook,
    updateBook,
    deleteBook,
    searchBooks,
    getBooksPage
};