const validation = (req, res, next) => {

  if (req.method === 'POST' && req.path === '/books') {
    const { auteur_id, titre, annee } = req.body;

    if (!auteur_id || !titre || !annee) {
      return res.status(400).send({
        message: 'Les champs auteur_id, titre et année sont obligatoires'
      });
    }
  }

  if (req.method === 'POST' && req.path === '/authors') {
    const { nom, prenom, nationalite } = req.body;

    if (!nom || !prenom || !nationalite) {
      return res.status(400).send({
        message: 'Les champs nom, prénom et nationalité sont obligatoires'
      });
    }
  }

  if (req.method === 'POST' && req.path === '/members') {
    const { nom, prenom, contact } = req.body;

    if (!nom || !prenom || !contact) {
      return res.status(400).send({
        message: 'Les champs nom, prénom et contact sont obligatoires'
      });
    }
  }

  if (req.method === 'POST' && req.path === '/loans') {
    const { memberId, bookId, dateRetourPrevue } = req.body;

    if (!memberId || !bookId || !dateRetourPrevue) {
      return res.status(400).send({
        message:
          'Les champs memberId, bookId et dateRetourPrevue sont obligatoires'
      });
    }
  }

  next();
};

module.exports = validation;