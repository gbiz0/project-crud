
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const authRoutes = require('./routes/authRoutes');
const fornecedorRoutes = require('./routes/fornecedorRoutes');
const contaPagarRoutes = require('./routes/contaPagarRoutes');

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/fornecedores', fornecedorRoutes);
app.use('/api/contas', contaPagarRoutes);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
