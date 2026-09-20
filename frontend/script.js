// ============================================
// CONFIGURATION
// ============================================

const API_URL = '';


// ============================================
// NAVIGATION
// ============================================

const navButtons =
  document.querySelectorAll('nav button');

const sections =
  document.querySelectorAll('.section');


navButtons.forEach((button) => {

  button.addEventListener('click', () => {

    const sectionId =
      button.dataset.section;

    sections.forEach((section) => {
      section.classList.remove('active');
    });

    const selectedSection =
      document.getElementById(sectionId);

    selectedSection.classList.add('active');

  });

});


// ============================================
// ÉLÉMENTS DU DOM
// ============================================

// Dashboard

const totalLivresElement =
  document.getElementById('totalLivres');

const totalAdherentsElement =
  document.getElementById('totalAdherents');

const empruntsEnCoursElement =
  document.getElementById('empruntsEnCours');

const empruntsEnRetardElement =
  document.getElementById('empruntsEnRetard');

const livreLePlusEmprunteElement =
  document.getElementById('livreLePlusEmprunte');

const adherentLePlusActifElement =
  document.getElementById('adherentLePlusActif');


// Livres

const booksTableBody =
  document.getElementById('booksTableBody');

const bookForm =
  document.getElementById('bookForm');

const bookTitle =
  document.getElementById('bookTitle');

const bookAuthor =
  document.getElementById('bookAuthor');

const bookYear =
  document.getElementById('bookYear');

const searchBookForm =
  document.getElementById('searchBookForm');

const searchBookInput =
  document.getElementById('searchBookInput');


// Adhérents

const membersTableBody =
  document.getElementById('membersTableBody');

const memberForm =
  document.getElementById('memberForm');

const memberLastName =
  document.getElementById('memberLastName');

const memberFirstName =
  document.getElementById('memberFirstName');

const memberContact =
  document.getElementById('memberContact');


// Emprunts

const loanForm =
  document.getElementById('loanForm');

const loanMember =
  document.getElementById('loanMember');

const loanBook =
  document.getElementById('loanBook');

const loanDueDate =
  document.getElementById('loanDueDate');

const currentLoansTableBody =
  document.getElementById('currentLoansTableBody');

const overdueLoansTableBody =
  document.getElementById('overdueLoansTableBody');


// ============================================
// CHARGER LE DASHBOARD
// ============================================

const loadDashboard = async () => {

  try {

    const response =
      await fetch(`${API_URL}/dashboard`);

    const data =
      await response.json();


    totalLivresElement.textContent =
      data.totalLivres;

    totalAdherentsElement.textContent =
      data.totalAdherents;

    empruntsEnCoursElement.textContent =
      data.empruntsEnCours;

    empruntsEnRetardElement.textContent =
      data.empruntsEnRetard;


    if (data.livreLePlusEmprunte) {

      livreLePlusEmprunteElement.textContent =
        `${data.livreLePlusEmprunte.titre} ` +
        `(${data.livreLePlusEmprunte.nombre_emprunts} emprunts)`;

    } else {

      livreLePlusEmprunteElement.textContent =
        'Aucun';

    }


    if (data.adherentLePlusActif) {

      adherentLePlusActifElement.textContent =
        `${data.adherentLePlusActif.prenom} ` +
        `${data.adherentLePlusActif.nom} ` +
        `(${data.adherentLePlusActif.nombre_emprunts} emprunts)`;

    } else {

      adherentLePlusActifElement.textContent =
        'Aucun';

    }

  } catch (error) {

    console.error(
      'Erreur lors du chargement du dashboard :',
      error
    );

  }

};


// ============================================
// CHARGER LES AUTEURS
// ============================================

const loadAuthors = async () => {

  try {

    const response =
      await fetch(`${API_URL}/authors`);

    const authors =
      await response.json();


    bookAuthor.innerHTML =
      '<option value="">Choisir un auteur</option>';


    authors.forEach((author) => {

      const option =
        document.createElement('option');

      option.value =
        author.id;

      option.textContent =
        `${author.prenom} ${author.nom}`;

      bookAuthor.appendChild(option);

    });

  } catch (error) {

    console.error(
      'Erreur lors du chargement des auteurs :',
      error
    );

  }

};


// ============================================
// AFFICHER LES LIVRES
// ============================================

const displayBooks = (books) => {

  booksTableBody.innerHTML = '';


  if (books.length === 0) {

    booksTableBody.innerHTML = `
      <tr>
        <td colspan="6">
          Aucun livre trouvé
        </td>
      </tr>
    `;

    return;
  }


  books.forEach((book) => {

    const row =
      document.createElement('tr');


    const status =
      book.disponible
        ? '<span class="status-available">Disponible</span>'
        : '<span class="status-borrowed">Emprunté</span>';


    row.innerHTML = `
      <td>${book.id}</td>

      <td>${book.titre}</td>

      <td>${book.auteur}</td>

      <td>${book.annee}</td>

      <td>${status}</td>

      <td></td>
    `;


    const actionCell =
      row.querySelector('td:last-child');


    const deleteButton =
      document.createElement('button');

    deleteButton.className =
      'action-button delete-button';

    deleteButton.textContent =
      'Supprimer';


    deleteButton.addEventListener(
      'click',
      () => deleteBook(book.id)
    );


    actionCell.appendChild(deleteButton);

    booksTableBody.appendChild(row);

  });

};


// ============================================
// CHARGER LES LIVRES
// ============================================

const loadBooks = async () => {

  try {

    const response =
      await fetch(`${API_URL}/books`);

    const books =
      await response.json();


    displayBooks(books);

    loadLoanBooks(books);

  } catch (error) {

    console.error(
      'Erreur lors du chargement des livres :',
      error
    );

  }

};


// ============================================
// AJOUTER UN LIVRE
// ============================================

bookForm.addEventListener(
  'submit',
  async (event) => {

    event.preventDefault();


    const newBook = {

      auteur_id:
        Number(bookAuthor.value),

      titre:
        bookTitle.value.trim(),

      annee:
        Number(bookYear.value)

    };


    try {

      const response =
        await fetch(`${API_URL}/books`, {

          method: 'POST',

          headers: {
            'Content-Type': 'application/json'
          },

          body:
            JSON.stringify(newBook)

        });


      const data =
        await response.json();


      if (!response.ok) {

        alert(data.message);

        return;

      }


      alert(
        'Livre ajouté avec succès'
      );


      bookForm.reset();


      await loadBooks();

      await loadDashboard();

    } catch (error) {

      console.error(
        'Erreur lors de l’ajout du livre :',
        error
      );

    }

  }
);


// ============================================
// SUPPRIMER UN LIVRE
// ============================================

const deleteBook = async (id) => {

  const confirmation =
    confirm(
      'Voulez-vous vraiment supprimer ce livre ?'
    );


  if (!confirmation) {
    return;
  }


  try {

    const response =
      await fetch(
        `${API_URL}/books/${id}`,
        {
          method: 'DELETE'
        }
      );


    const data =
      await response.json();


    if (!response.ok) {

      alert(data.message);

      return;

    }


    alert(
      'Livre supprimé avec succès'
    );


    await loadBooks();

    await loadDashboard();

  } catch (error) {

    console.error(
      'Erreur lors de la suppression du livre :',
      error
    );

  }

};


// ============================================
// RECHERCHE DE LIVRES
// ============================================

searchBookForm.addEventListener(
  'submit',
  async (event) => {

    event.preventDefault();


    const search =
      searchBookInput.value.trim();


    if (!search) {

      await loadBooks();

      return;

    }


    try {

      const response =
        await fetch(
          `${API_URL}/books/search?q=${encodeURIComponent(search)}`
        );


      const books =
        await response.json();


      if (!response.ok) {

        alert(books.message);

        return;

      }


      displayBooks(books);

    } catch (error) {

      console.error(
        'Erreur lors de la recherche :',
        error
      );

    }

  }
);


// ============================================
// AFFICHER LES ADHÉRENTS
// ============================================

const displayMembers = (members) => {

  membersTableBody.innerHTML = '';


  if (members.length === 0) {

    membersTableBody.innerHTML = `
      <tr>
        <td colspan="5">
          Aucun adhérent trouvé
        </td>
      </tr>
    `;

    return;
  }


  members.forEach((member) => {

    const row =
      document.createElement('tr');


    row.innerHTML = `
      <td>${member.id}</td>

      <td>${member.nom}</td>

      <td>${member.prenom}</td>

      <td>${member.contact}</td>

      <td></td>
    `;


    const actionCell =
      row.querySelector('td:last-child');


    // Bouton historique

    const historyButton =
      document.createElement('button');

    historyButton.className =
      'action-button';

    historyButton.textContent =
      'Historique';


    historyButton.addEventListener(
      'click',
      () => showMemberHistory(member.id)
    );


    // Bouton supprimer

    const deleteButton =
      document.createElement('button');

    deleteButton.className =
      'action-button delete-button';

    deleteButton.textContent =
      'Supprimer';


    deleteButton.addEventListener(
      'click',
      () => deleteMember(member.id)
    );


    actionCell.appendChild(historyButton);

    actionCell.appendChild(deleteButton);


    membersTableBody.appendChild(row);

  });

};


// ============================================
// CHARGER LES ADHÉRENTS
// ============================================

const loadMembers = async () => {

  try {

    const response =
      await fetch(`${API_URL}/members`);

    const members =
      await response.json();


    displayMembers(members);

    loadLoanMembers(members);

  } catch (error) {

    console.error(
      'Erreur lors du chargement des adhérents :',
      error
    );

  }

};


// ============================================
// AJOUTER UN ADHÉRENT
// ============================================

memberForm.addEventListener(
  'submit',
  async (event) => {

    event.preventDefault();


    const newMember = {

      nom:
        memberLastName.value.trim(),

      prenom:
        memberFirstName.value.trim(),

      contact:
        memberContact.value.trim()

    };


    try {

      const response =
        await fetch(`${API_URL}/members`, {

          method: 'POST',

          headers: {
            'Content-Type': 'application/json'
          },

          body:
            JSON.stringify(newMember)

        });


      const data =
        await response.json();


      if (!response.ok) {

        alert(data.message);

        return;

      }


      alert(
        'Adhérent ajouté avec succès'
      );


      memberForm.reset();


      await loadMembers();

      await loadDashboard();

    } catch (error) {

      console.error(
        'Erreur lors de l’ajout de l’adhérent :',
        error
      );

    }

  }
);


// ============================================
// SUPPRIMER UN ADHÉRENT
// ============================================

const deleteMember = async (id) => {

  const confirmation =
    confirm(
      'Voulez-vous vraiment supprimer cet adhérent ?'
    );


  if (!confirmation) {
    return;
  }


  try {

    const response =
      await fetch(
        `${API_URL}/members/${id}`,
        {
          method: 'DELETE'
        }
      );


    const data =
      await response.json();


    if (!response.ok) {

      alert(data.message);

      return;

    }


    alert(
      'Adhérent supprimé avec succès'
    );


    await loadMembers();

    await loadDashboard();

  } catch (error) {

    console.error(
      'Erreur lors de la suppression de l’adhérent :',
      error
    );

  }

};


// ============================================
// HISTORIQUE D'UN ADHÉRENT
// ============================================

const showMemberHistory = async (id) => {

  try {

    const response =
      await fetch(
        `${API_URL}/members/${id}/loans`
      );


    const loans =
      await response.json();


    if (!response.ok) {

      alert(loans.message);

      return;

    }


    if (loans.length === 0) {

      alert(
        'Aucun emprunt dans l’historique de cet adhérent.'
      );

      return;

    }


    const history =
      loans.map((loan) => {

        const dateEmprunt =
          new Date(
            loan.date_emprunt
          ).toLocaleDateString('fr-FR');


        const dateRetourPrevue =
          new Date(
            loan.date_retour_prevue
          ).toLocaleDateString('fr-FR');


        const dateRetour =
          loan.date_retour
            ? new Date(
                loan.date_retour
              ).toLocaleDateString('fr-FR')
            : 'Non retourné';


        return (
          `Livre : ${loan.livre}\n` +
          `Emprunt : ${dateEmprunt}\n` +
          `Retour prévu : ${dateRetourPrevue}\n` +
          `Retour : ${dateRetour}`
        );

      }).join(
        '\n\n--------------------\n\n'
      );


    alert(history);

  } catch (error) {

    console.error(
      'Erreur lors du chargement de l’historique :',
      error
    );

  }

};


// ============================================
// CHARGER LES LIVRES POUR LES EMPRUNTS
// ============================================

const loadLoanBooks = (books) => {

  loanBook.innerHTML =
    '<option value="">Choisir un livre</option>';


  books
    .filter((book) => book.disponible)
    .forEach((book) => {

      const option =
        document.createElement('option');

      option.value =
        book.id;

      option.textContent =
        book.titre;

      loanBook.appendChild(option);

    });

};


// ============================================
// CHARGER LES ADHÉRENTS POUR LES EMPRUNTS
// ============================================

const loadLoanMembers = (members) => {

  loanMember.innerHTML =
    '<option value="">Choisir un adhérent</option>';


  members.forEach((member) => {

    const option =
      document.createElement('option');

    option.value =
      member.id;

    option.textContent =
      `${member.prenom} ${member.nom}`;

    loanMember.appendChild(option);

  });

};


// ============================================
// CRÉER UN EMPRUNT
// ============================================

loanForm.addEventListener(
  'submit',
  async (event) => {

    event.preventDefault();


    const newLoan = {

      memberId:
        Number(loanMember.value),

      bookId:
        Number(loanBook.value),

      dateRetourPrevue:
        loanDueDate.value

    };


    try {

      const response =
        await fetch(`${API_URL}/loans`, {

          method: 'POST',

          headers: {
            'Content-Type': 'application/json'
          },

          body:
            JSON.stringify(newLoan)

        });


      const data =
        await response.json();


      if (!response.ok) {

        alert(data.message);

        return;

      }


      alert(
        'Emprunt enregistré avec succès'
      );


      loanForm.reset();


      await loadBooks();

      await loadCurrentLoans();

      await loadOverdueLoans();

      await loadDashboard();

    } catch (error) {

      console.error(
        'Erreur lors de la création de l’emprunt :',
        error
      );

    }

  }
);


// ============================================
// AFFICHER LES EMPRUNTS EN COURS
// ============================================

const displayCurrentLoans = (loans) => {

  currentLoansTableBody.innerHTML = '';


  if (loans.length === 0) {

    currentLoansTableBody.innerHTML = `
      <tr>
        <td colspan="5">
          Aucun emprunt en cours
        </td>
      </tr>
    `;

    return;
  }


  loans.forEach((loan) => {

    const row =
      document.createElement('tr');


    row.innerHTML = `
      <td>${loan.adherent}</td>

      <td>${loan.livre}</td>

      <td>
        ${new Date(
          loan.date_emprunt
        ).toLocaleDateString('fr-FR')}
      </td>

      <td>
        ${new Date(
          loan.date_retour_prevue
        ).toLocaleDateString('fr-FR')}
      </td>

      <td></td>
    `;


    const actionCell =
      row.querySelector('td:last-child');


    const returnButton =
      document.createElement('button');

    returnButton.className =
      'action-button return-button';

    returnButton.textContent =
      'Retourner';


    returnButton.addEventListener(
      'click',
      () => returnLoan(loan.id)
    );


    actionCell.appendChild(returnButton);

    currentLoansTableBody.appendChild(row);

  });

};


// ============================================
// CHARGER LES EMPRUNTS EN COURS
// ============================================

const loadCurrentLoans = async () => {

  try {

    const response =
      await fetch(`${API_URL}/loans/current`);

    const loans =
      await response.json();


    displayCurrentLoans(loans);

  } catch (error) {

    console.error(
      'Erreur lors du chargement des emprunts en cours :',
      error
    );

  }

};


// ============================================
// AFFICHER LES EMPRUNTS EN RETARD
// ============================================

const displayOverdueLoans = (loans) => {

  overdueLoansTableBody.innerHTML = '';


  if (loans.length === 0) {

    overdueLoansTableBody.innerHTML = `
      <tr>
        <td colspan="4">
          Aucun emprunt en retard
        </td>
      </tr>
    `;

    return;
  }


  loans.forEach((loan) => {

    const row =
      document.createElement('tr');


    row.innerHTML = `
      <td>${loan.adherent}</td>

      <td>${loan.livre}</td>

      <td>
        ${new Date(
          loan.date_emprunt
        ).toLocaleDateString('fr-FR')}
      </td>

      <td>
        <span class="status-overdue">
          ${new Date(
            loan.date_retour_prevue
          ).toLocaleDateString('fr-FR')}
        </span>
      </td>
    `;


    overdueLoansTableBody.appendChild(row);

  });

};


// ============================================
// CHARGER LES EMPRUNTS EN RETARD
// ============================================

const loadOverdueLoans = async () => {

  try {

    const response =
      await fetch(`${API_URL}/loans/overdue`);

    const loans =
      await response.json();


    displayOverdueLoans(loans);

  } catch (error) {

    console.error(
      'Erreur lors du chargement des emprunts en retard :',
      error
    );

  }

};


// ============================================
// RETOURNER UN LIVRE
// ============================================

const returnLoan = async (id) => {

  const confirmation =
    confirm(
      'Confirmer le retour de ce livre ?'
    );


  if (!confirmation) {
    return;
  }


  try {

    const response =
      await fetch(
        `${API_URL}/loans/${id}/return`,
        {
          method: 'POST'
        }
      );


    const data =
      await response.json();


    if (!response.ok) {

      alert(data.message);

      return;

    }


    alert(
      'Livre retourné avec succès'
    );


    await loadBooks();

    await loadCurrentLoans();

    await loadOverdueLoans();

    await loadDashboard();

  } catch (error) {

    console.error(
      'Erreur lors du retour du livre :',
      error
    );

  }

};


// ============================================
// INITIALISATION
// ============================================

const initializeApp = async () => {

  await loadDashboard();

  await loadAuthors();

  await loadBooks();

  await loadMembers();

  await loadCurrentLoans();

  await loadOverdueLoans();

};


// ============================================
// LANCER L'APPLICATION
// ============================================

initializeApp();