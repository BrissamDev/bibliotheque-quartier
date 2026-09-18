const express = require('express');

const router = express.Router();

const {
    createLoan,
    getLoans,
    getCurrentLoans,
    getOverdueLoans,
    returnLoan
} = require('../controllers/loansController');


router.get('/current', getCurrentLoans);
router.get('/overdue', getOverdueLoans);

router.get('/', getLoans);
router.post('/', createLoan);

router.post('/:id/return', returnLoan);

module.exports = router;