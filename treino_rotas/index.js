const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
const port = 3000;

// Configurações do banco de dados
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'simba123',
  database: 'minha_escola'
});


// Rotas para Instrumentos
app.use(express.json());

// Rotas para Instrumentos
app.get('/instrumentos/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM instrumentos WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Instrumento não encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Erro ao buscar instrumento:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.post('/instrumentos', async (req, res) => {
  try {
    const { nome, tipo } = req.body;
    const [result] = await pool.query('INSERT INTO instrumentos (nome, tipo) VALUES (?, ?)', [nome, tipo]);
    res.status(201).json({ message: 'Instrumento criado com sucesso', id: result.insertId });
  } catch (error) {
    console.error('Erro ao criar instrumento:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});


app.put('/instrumentos/:id', async (req, res) => {
  try {
    const { nome, tipo } = req.body;
    const [result] = await pool.query('UPDATE instrumentos SET nome = ?, tipo = ? WHERE id = ?', [nome, tipo, req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Instrumento não encontrado' });
    }
    res.json({ message: 'Instrumento atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar instrumento:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.delete('/instrumentos/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM instrumentos WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Instrumento não encontrado' });
    }
    res.json({ message: 'Instrumento deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar instrumento:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rotas para Alunos, Instrutores e Frequência (similar às rotas de Instrumentos)
// ...

app.listen(port, () => {
  console.log(`Servidor ouvindo na porta ${port}`);
});