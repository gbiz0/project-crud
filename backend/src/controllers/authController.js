const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const register = async (req, res) => {
    const { login, senha } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(senha, 10);
        const newUser = await pool.query(
            'INSERT INTO Usuario (Login, Senha) VALUES ($1, $2) RETURNING id, login',
            [login, hashedPassword]
        );
        res.status(201).json({ message: 'Usuário registrado com sucesso', user: newUser.rows[0] });
    } catch (err) {
        console.error(err);
        if (err.code === '23505') { // Unique violation error code
            return res.status(400).json({ message: 'Login já existe' });
        }
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

const login = async (req, res) => {
    const { login, senha } = req.body;

    try {
        const userResult = await pool.query('SELECT * FROM Usuario WHERE Login = $1 AND Removido = false', [login]);
        const user = userResult.rows[0];

        if (!user) {
            return res.status(400).json({ message: 'Credenciais inválidas' });
        }

        const isMatch = await bcrypt.compare(senha, user.senha);

        if (!isMatch) {
            return res.status(400).json({ message: 'Credenciais inválidas' });
        }

        const token = jwt.sign({ id: user.id, login: user.login }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

module.exports = { login, register };
