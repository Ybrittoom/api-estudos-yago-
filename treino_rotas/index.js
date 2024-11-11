const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Configurações do banco de dados
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'simba123',
  database: 'minha_escola'
});

app.use(cors());
app.use(bodyParser.json());

// Rotas para Instrumentos
app.use(express.json());


// Rota para obter todos os registros
app.get('/instrumentos', (req, res) => {
  pool.query('SELECT * FROM instrumentos', (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Erro ao buscar usuários');
    } else {
      res.json(results);
    }
  });
});

// Rota para criar um novo registro
app.post('/instrumentos', (req, res) => {
  const { nome, tipo } = req.body;
  pool.query('INSERT INTO instrumentos (nome,tipo) VALUES (?, ?)', [nome, tipo], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Erro ao criar usuário');
    } else {
      res.json({ id: result.insertId });
    }
  });
});

// Rota para atualizar um registro
app.put('/instrumentos/:id', (req, res) => {
  const { id } = req.params;
  const { nome, tipo } = req.body;
  pool.query('UPDATE instrumentos SET nome = ?, tipo = ? WHERE id = ?', [nome, tipo, id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Erro ao atualizar usuário');
    } else {
      res.send('Usuário atualizado com sucesso');
    }
  });
});

// Rota para deletar um registro
app.delete('/instrumentos/:id', (req, res) => {
  const { id } = req.params;
  pool.query('DELETE FROM users WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Erro ao deletar usuário');
    } else {
      res.send('Usuário deletado com sucesso');
    }
  });
});

/*
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

*/

// Rotas para Alunos

app.post('/alunos', async (req, res) => {
  try {
    const { nome, idade } = req.body;
    const [result] = await pool.query('INSERT INTO alunos (nome, idade) VALUES (?, ?)', [nome, idade]);
    res.status(201).json({ message: 'Aluno criado com sucesso', id: result.insertId });
  } catch (error) {
    console.error('Erro ao criar o aluno:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});


//Instrutores 

app.post('/instrutores', async (req, res) => {
  try {
    const { nome, atividade } = req.body;
    const [result] = await pool.query('INSERT INTO instrutores (nome, atividade) VALUES (?, ?)', [nome, atividade]);
    res.status(201).json({ message: 'Instrutor criado com sucesso', id: result.insertId });
  } catch (error) {
    console.error('Erro ao criar instrutor:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

 
// Frequência 
app.post('/frequencia', async (req, res) => {
  try {
    const { nome, faltas } = req.body;
    const [result] = await pool.query('INSERT INTO frequencia (nome, faltas) VALUES (?, ?)', [nome, faltas]);
    res.status(201).json({ message: 'frequência criado com sucesso', id: result.insertId });
  } catch (error) {
    console.error('Erro ao criar frequencia:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.listen(port, () => {
  console.log(`Servidor ouvindo na porta ${port}`);
});