const pool = require('./db');

pool.query('SELECT NOW()', (error, result) => {
  if (error) {
    console.error('Erreur de connexion :', error);
  } else {
    console.log('Connexion PostgreSQL réussie !');
    console.log(result.rows);
  }

  pool.end();
});