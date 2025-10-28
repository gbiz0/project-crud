const pool = require('../config/db');

const getAllFornecedores = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Fornecedor WHERE Removido = false');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

const getFornecedorById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM Fornecedor WHERE ID = $1 AND Removido = false', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Fornecedor não encontrado' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

const insertFornecedor = async (req, res) => {
    const { nomefantasia, razaosocial, cnpj } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO Fornecedor (NomeFantasia, RazaoSocial, CNPJ) VALUES ($1, $2, $3) RETURNING * ',
            [nomefantasia, razaosocial, cnpj]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

const updateFornecedor = async (req, res) => {
    const { id } = req.params;
    const { nomefantasia, razaosocial, cnpj } = req.body;
    try {
        const result = await pool.query(
            'UPDATE Fornecedor SET NomeFantasia = $1, RazaoSocial = $2, CNPJ = $3 WHERE ID = $4 AND Removido = false RETURNING * ',
            [nomefantasia, razaosocial, cnpj, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Fornecedor não encontrado' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

const deleteFornecedor = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'UPDATE Fornecedor SET Removido = true WHERE ID = $1 AND Removido = false RETURNING * ',
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Fornecedor não encontrado' });
        }
        res.json({ message: 'Fornecedor removido com sucesso' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

module.exports = {
    getAllFornecedores,
    getFornecedorById,
    insertFornecedor,
    updateFornecedor,
    deleteFornecedor,
};
