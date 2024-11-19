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



// Rotas para Alunos

app.get('/alunos/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM alunos WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'aluno não encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Erro ao buscar aluno:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

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

// Rota para atualizar um alunos
app.put('/alunos/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, idade } = req.body; // Adapte os campos conforme sua tabela
  try {
    const [result] = await pool.query('UPDATE alunos SET nome = ?, idade = ? WHERE id = ?', [nome, idade, id]);
    if (result.affectedRows === 0) {
      return res.status(404).send('aluno não encontrado');
    }
    res.send('aluno atualizado com sucesso');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao atualizar aluno');
  }
});

// Rota para deletar um aluno 
app.delete('/aluno/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM alunos WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).send('aluno não encontrado');
    }
    res.send('aluno deletado com sucesso');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao deletar aluno');
  }
});


//instrutores 

// Rota para obter todos os instrutores
app.get('/instrutores', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM instrutores');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao buscar instrutores');
  }
});

// Rota para criar um novo instrutor
app.post('/instrutores', async (req, res) => {
  const { nome, atividade} = req.body; // Adapte os campos conforme sua tabela
  try {
    const [result] = await pool.query('INSERT INTO instrutores (nome, atividade) VALUES (?, ?)', [nome, atividade]);
    res.json({ id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao criar instrutor');
  }
});

// Rota para atualizar um instrutor
app.put('/instrutores/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, atividade } = req.body; // Adapte os campos conforme sua tabela
  try {
    const [result] = await pool.query('UPDATE instrutores SET nome = ?, atividade = ? WHERE id = ?', [nome, atividade, id]);
    if (result.affectedRows === 0) {
      return res.status(404).send('Instrutor não encontrado');
    }
    res.send('Instrutor atualizado com sucesso');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao atualizar instrutor');
  }
});

// Rota para deletar um instrutor
app.delete('/instrutores/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM instrutores WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).send('Instrutor não encontrado');
    }
    res.send('Instrutor deletado com sucesso');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao deletar instrutor');
  }
});




 
// Frequência 

// Rota para obter frequência 
app.get('/frequencia', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM frequencia');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao buscar frequencia');
  }
});

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

// Rota para atualizar frequência 
app.put('/frequencia/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, faltas } = req.body; // Adapte os campos conforme sua tabela
  try {
    const [result] = await pool.query('UPDATE frequencia SET nome = ?, faltas = ? WHERE id = ?', [nome, faltas, id]);
    if (result.affectedRows === 0) {
      return res.status(404).send('frequencia não encontrada');
    }
    res.send('frequencia atualizado com sucesso');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao atualizar frequência');
  }
});

// Rota para deletar frequência 
app.delete('/frequencia/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM frequencia WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).send('frequencia não encontrada');
    }
    res.send('frequencia deletado com sucesso');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao deletar frequência');
  }
});

app.listen(port, () => {
  console.log(`Servidor ouvindo na porta ${port}`);
});