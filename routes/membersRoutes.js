const express = require('express');

const router = express.Router();

const {
    getMembers,
    createMember,
    updateMember,
    deleteMember,
    getMemberLoans
} = require('../controllers/membersController');


router.get('/', getMembers);
router.post('/', createMember);
router.put('/:id', updateMember);
router.delete('/:id', deleteMember);

router.get('/:id/loans', getMemberLoans);

module.exports = router;