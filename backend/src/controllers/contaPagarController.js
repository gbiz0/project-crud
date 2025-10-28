const pool = require('../config/db');

const getAllContasPagar = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM ContaPagar WHERE Removido = false');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

const getContaPagarById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM ContaPagar WHERE ID = $1 AND Removido = false', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Conta a Pagar não encontrada' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

const insertContaPagar = async (req, res) => {
    const { descricao, datavencimento, valor, datapagamento, valorpago, fornecedorid } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO ContaPagar (Descricao, DataVencimento, Valor, DataPagamento, ValorPago, FornecedorID) VALUES ($1, $2, $3, $4, $5, $6) RETURNING * ',
            [descricao, datavencimento, valor, datapagamento, valorpago, fornecedorid]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

const updateContaPagar = async (req, res) => {
    const { id } = req.params;
    const { descricao, datavencimento, valor, datapagamento, valorpago, fornecedorid } = req.body;
    try {
        const result = await pool.query(
            'UPDATE ContaPagar SET Descricao = $1, DataVencimento = $2, Valor = $3, DataPagamento = $4, ValorPago = $5, FornecedorID = $6 WHERE ID = $7 AND Removido = false RETURNING * ',
            [descricao, datavencimento, valor, datapagamento, valorpago, fornecedorid, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Conta a Pagar não encontrada' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

const deleteContaPagar = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'UPDATE ContaPagar SET Removido = true WHERE ID = $1 AND Removido = false RETURNING * ',
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Conta a Pagar não encontrada' });
        }
        res.json({ message: 'Conta a Pagar removida com sucesso' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

module.exports = {
    getAllContasPagar,
    getContaPagarById,
    insertContaPagar,
    updateContaPagar,
    deleteContaPagar,
};
