const express = require('express');
const router = express.Router();
const contaPagarController = require('../controllers/contaPagarController');
const authenticateToken = require('../middlewares/authMiddleware');

router.get('/', authenticateToken, contaPagarController.getAllContasPagar);
router.get('/:id', authenticateToken, contaPagarController.getContaPagarById);
router.post('/', authenticateToken, contaPagarController.insertContaPagar);
router.put('/:id', authenticateToken, contaPagarController.updateContaPagar);
router.delete('/:id', authenticateToken, contaPagarController.deleteContaPagar);

module.exports = router;
