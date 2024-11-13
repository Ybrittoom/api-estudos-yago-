const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Conexão com o banco de dados
const pool = mysql.createPool({
    host: 'localhost', 
    user: 'root',
    password: 'simba123',
    database: 'minha_escola'
});

app.use(cors());
app.use(bodyParser.json());

// Exemplo de rota para buscar todos os instrutores 

app.get('/instrutores', (req, res) => {
    pool.query('SELECT * FROM instrumentos', (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Erro ao buscar instrumentos');
        } else {
            res.json(results);
        }
    });
});


app.post('/instrutores', async (req, res) => {
  const { nome, atividade } = req.body;

  // Validação dos dados (exemplo usando Joi)
  const schema = Joi.object({
    nome: Joi.string().required(),
    atividade: Joi.string().required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO instrutores (nome, atividade) VALUES (?, ?)',
      [nome, atividade]
    );
    res.json({ id: result.insertId });
  } catch (error) {
    console.error(error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).send('Instrutor já existe');
    }
    res.status(500).send('Erro ao criar instrutor: ' + error.message);
  }
});


// Rota para atualizar um instrutor
app.put('/instrutores/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, atividade } = req.body; // Adapte os campos conforme sua tabela
  try {
    const [result] = await pool.query('UPDATE instrutores SET nome = ?, atividade= ? WHERE id = ?', [nome, atividade, id]);
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


app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
