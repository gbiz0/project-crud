const express = require('express');
const router = express.Router();
const fornecedorController = require('../controllers/fornecedorController');
const authenticateToken = require('../middlewares/authMiddleware');

router.get('/', authenticateToken, fornecedorController.getAllFornecedores);
router.get('/:id', authenticateToken, fornecedorController.getFornecedorById);
router.post('/', authenticateToken, fornecedorController.insertFornecedor);
router.put('/:id', authenticateToken, fornecedorController.updateFornecedor);
router.delete('/:id', authenticateToken, fornecedorController.deleteFornecedor);

module.exports = router;
