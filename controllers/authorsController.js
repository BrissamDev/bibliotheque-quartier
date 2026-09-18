const pool = require('../db');

const getAuthors = async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT * FROM authors ORDER BY id'
    );

    res.send(result.rows);
  } catch (error) {
    next(error);
  }
};

const createAuthor = async (req, res, next) => {
  try {
    const { nom, prenom, nationalite } = req.body;

    const result = await pool.query(
      `INSERT INTO authors (nom, prenom, nationalite)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [nom, prenom, nationalite]
    );

    res.status(201).send(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

const updateAuthor = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { nom, prenom, nationalite } = req.body;

    const result = await pool.query(
      `UPDATE authors
       SET nom = $1, prenom = $2, nationalite = $3
       WHERE id = $4
       RETURNING *`,
      [nom, prenom, nationalite, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send({
        message: 'Auteur non trouvé'
      });
    }

    res.send(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

const deleteAuthor = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    const result = await pool.query(
      'DELETE FROM authors WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send({
        message: 'Auteur non trouvé'
      });
    }

    res.send({
      message: 'Auteur supprimé avec succès'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAuthors,
  createAuthor,
  updateAuthor,
  deleteAuthor
};