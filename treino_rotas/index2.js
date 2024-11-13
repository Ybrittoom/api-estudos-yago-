const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Conexão com o banco de dados
const pool = mysql.createPool({
    host: 'localhost', // Substitua por seu host se necessário
    user: 'root',
    password: 'simba123',
    database: 'minha_escola'
});

app.use(cors());
app.use(bodyParser.json());

// Exemplo de rota para buscar todos os instrumentos
app.get('/instrumentos', (req, res) => {
    pool.query('SELECT * FROM instrumentos', (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Erro ao buscar instrumentos');
        } else {
            res.json(results);
        }
    });
});

// ... outras rotas para POST, PUT, DELETE e outras tabelas

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
