const pool = require('../db');


// GET - tous les adhérents
const getMembers = async (req, res, next) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM members
      ORDER BY id
    `);

    res.send(result.rows);
  } catch (error) {
    next(error);
  }
};


// POST - ajouter un adhérent
const createMember = async (req, res, next) => {
  try {
    const { nom, prenom, contact } = req.body;

    const result = await pool.query(
      `INSERT INTO members (nom, prenom, contact)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [nom, prenom, contact]
    );

    res.status(201).send(result.rows[0]);
  } catch (error) {
    next(error);
  }
};


// PUT - modifier
const updateMember = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { nom, prenom, contact } = req.body;

    const result = await pool.query(
      `UPDATE members
       SET nom = $1,
           prenom = $2,
           contact = $3
       WHERE id = $4
       RETURNING *`,
      [nom, prenom, contact, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send({
        message: 'Adhérent non trouvé'
      });
    }

    res.send(result.rows[0]);
  } catch (error) {
    next(error);
  }
};


// DELETE
const deleteMember = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    const result = await pool.query(
      `DELETE FROM members
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send({
        message: 'Adhérent non trouvé'
      });
    }

    res.send({
      message: 'Adhérent supprimé avec succès'
    });
  } catch (error) {
    next(error);
  }
};


// Historique des emprunts d'un adhérent
const getMemberLoans = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    const member = await pool.query(
      'SELECT * FROM members WHERE id = $1',
      [id]
    );

    if (member.rows.length === 0) {
      return res.status(404).send({
        message: 'Adhérent non trouvé'
      });
    }

    const result = await pool.query(
      `SELECT
         loans.id,
         loans.book_id,
         books.titre AS livre,
         loans.date_emprunt,
         loans.date_retour_prevue,
         loans.date_retour
       FROM loans
       JOIN books
         ON loans.book_id = books.id
       WHERE loans.member_id = $1
       ORDER BY loans.id DESC`,
      [id]
    );

    res.send(result.rows);
  } catch (error) {
    next(error);
  }
};


module.exports = {
  getMembers,
  createMember,
  updateMember,
  deleteMember,
  getMemberLoans
};