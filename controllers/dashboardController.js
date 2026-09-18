const pool = require('../db');


const getDashboard = async (req, res, next) => {

  try {

    const totalLivres = await pool.query(
      'SELECT COUNT(*) FROM books'
    );


    const totalAdherents = await pool.query(
      'SELECT COUNT(*) FROM members'
    );


    const empruntsEnCours = await pool.query(`
      SELECT COUNT(*)
      FROM loans
      WHERE date_retour IS NULL
    `);


    const empruntsEnRetard = await pool.query(`
      SELECT COUNT(*)
      FROM loans
      WHERE date_retour IS NULL
        AND date_retour_prevue < CURRENT_DATE
    `);


    const livreLePlusEmprunte = await pool.query(`
      SELECT
        books.id,
        books.titre,
        COUNT(loans.id) AS nombre_emprunts
      FROM loans
      JOIN books
        ON loans.book_id = books.id
      GROUP BY books.id, books.titre
      ORDER BY COUNT(loans.id) DESC
      LIMIT 1
    `);


    const adherentLePlusActif = await pool.query(`
      SELECT
        members.id,
        members.nom,
        members.prenom,
        COUNT(loans.id) AS nombre_emprunts
      FROM loans
      JOIN members
        ON loans.member_id = members.id
      GROUP BY
        members.id,
        members.nom,
        members.prenom
      ORDER BY COUNT(loans.id) DESC
      LIMIT 1
    `);


    res.send({

      totalLivres:
        Number(totalLivres.rows[0].count),

      totalAdherents:
        Number(totalAdherents.rows[0].count),

      empruntsEnCours:
        Number(empruntsEnCours.rows[0].count),

      empruntsEnRetard:
        Number(empruntsEnRetard.rows[0].count),

      livreLePlusEmprunte:
        livreLePlusEmprunte.rows[0] || null,

      adherentLePlusActif:
        adherentLePlusActif.rows[0] || null

    });

  } catch (error) {
    next(error);
  }
};


module.exports = {
  getDashboard
};