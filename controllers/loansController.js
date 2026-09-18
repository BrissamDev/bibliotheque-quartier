const pool = require('../db');


// Créer un emprunt
const createLoan = async (req, res, next) => {

  const {
    memberId,
    bookId,
    dateRetourPrevue
  } = req.body;

  try {

    const member = await pool.query(
      'SELECT * FROM members WHERE id = $1',
      [memberId]
    );

    if (member.rows.length === 0) {
      return res.status(404).send({
        message: 'Adhérent non trouvé'
      });
    }


    const book = await pool.query(
      'SELECT * FROM books WHERE id = $1',
      [bookId]
    );

    if (book.rows.length === 0) {
      return res.status(404).send({
        message: 'Livre non trouvé'
      });
    }


    if (!book.rows[0].disponible) {
      return res.status(400).send({
        message: 'Livre déjà emprunté'
      });
    }


    const result = await pool.query(
      `INSERT INTO loans
       (member_id, book_id, date_retour_prevue)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [
        memberId,
        bookId,
        dateRetourPrevue
      ]
    );


    await pool.query(
      `UPDATE books
       SET disponible = false
       WHERE id = $1`,
      [bookId]
    );


    res.status(201).send(result.rows[0]);

  } catch (error) {
    next(error);
  }
};


// Tous les emprunts
const getLoans = async (req, res, next) => {

  try {

    const result = await pool.query(`
      SELECT
        loans.id,
        loans.member_id,
        CONCAT(
          members.prenom,
          ' ',
          members.nom
        ) AS adherent,
        loans.book_id,
        books.titre AS livre,
        loans.date_emprunt,
        loans.date_retour_prevue,
        loans.date_retour
      FROM loans
      JOIN members
        ON loans.member_id = members.id
      JOIN books
        ON loans.book_id = books.id
      ORDER BY loans.id
    `);

    res.send(result.rows);

  } catch (error) {
    next(error);
  }
};


// Emprunts en cours
const getCurrentLoans = async (req, res, next) => {

  try {

    const result = await pool.query(`
      SELECT
        loans.id,
        CONCAT(
          members.prenom,
          ' ',
          members.nom
        ) AS adherent,
        books.titre AS livre,
        loans.date_emprunt,
        loans.date_retour_prevue
      FROM loans
      JOIN members
        ON loans.member_id = members.id
      JOIN books
        ON loans.book_id = books.id
      WHERE loans.date_retour IS NULL
      ORDER BY loans.date_retour_prevue
    `);

    res.send(result.rows);

  } catch (error) {
    next(error);
  }
};


// Emprunts en retard
const getOverdueLoans = async (req, res, next) => {

  try {

    const result = await pool.query(`
      SELECT
        loans.id,
        CONCAT(
          members.prenom,
          ' ',
          members.nom
        ) AS adherent,
        books.titre AS livre,
        loans.date_emprunt,
        loans.date_retour_prevue
      FROM loans
      JOIN members
        ON loans.member_id = members.id
      JOIN books
        ON loans.book_id = books.id
      WHERE loans.date_retour IS NULL
        AND loans.date_retour_prevue < CURRENT_DATE
      ORDER BY loans.date_retour_prevue
    `);

    res.send(result.rows);

  } catch (error) {
    next(error);
  }
};


// Retourner un livre
const returnLoan = async (req, res, next) => {

  const id = Number(req.params.id);

  try {

    const loan = await pool.query(
      'SELECT * FROM loans WHERE id = $1',
      [id]
    );

    if (loan.rows.length === 0) {
      return res.status(404).send({
        message: 'Emprunt non trouvé'
      });
    }


    if (loan.rows[0].date_retour !== null) {
      return res.status(400).send({
        message: 'Cet emprunt a déjà été retourné'
      });
    }


    const returnedLoan = await pool.query(
      `UPDATE loans
       SET date_retour = CURRENT_DATE
       WHERE id = $1
       RETURNING *`,
      [id]
    );


    await pool.query(
      `UPDATE books
       SET disponible = true
       WHERE id = $1`,
      [loan.rows[0].book_id]
    );


    res.send(returnedLoan.rows[0]);

  } catch (error) {
    next(error);
  }
};


module.exports = {
  createLoan,
  getLoans,
  getCurrentLoans,
  getOverdueLoans,
  returnLoan
};