const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 8080;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Conexão com o banco de dados Supabase (PostgreSQL)
const pool = new Pool({
    connectionString: 'postgresql://postgres.ikjhufiucbzixzykedhr:@Tonystark19@aws-0-sa-east-1.pooler.supabase.com:6543/postgres',
    ssl: {
        rejectUnauthorized: false
    }
});

pool.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao Supabase:', err);
    } else {
        console.log('Conectado ao Supabase');
    }
});

// Definição das categorias permitidas
const categoriasPermitidas = [
    'pizzaria', 
    'lanchonete', 
    'restaurante', 
    'igreja', 
    'comercio', 
    'ponto turistico', 
    'sorveteria', 
    'açaiteria', 
    'shopping', 
    'evento', 
    'cinema'
];

// Rota para criar um novo comércio
app.post('/comercio', async (req, res) => {
    const { 
        nome, 
        categoria, 
        cidade, 
        estado, 
        telefone, 
        horario_funcionamento, 
        horario_funcionamento_feriados, 
        link_cardapio, 
        descricao, 
        imagem_capa,
        link_facebook,
        link_instagram,
        link_site_pessoal
    } = req.body;

    // Validação da categoria
    if (!categoriasPermitidas.includes(categoria)) {
        return res.status(400).send('Categoria inválida');
    }

    const query = `
        INSERT INTO comercios 
        (nome, categoria, cidade, estado, telefone, horario_funcionamento, 
        horario_funcionamento_feriados, link_cardapio, descricao, imagem_capa, 
        link_facebook, link_instagram, link_site_pessoal) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`;

    try {
        await pool.query(query, [
            nome, 
            categoria, 
            cidade, 
            estado, 
            telefone, 
            horario_funcionamento, 
            horario_funcionamento_feriados, 
            link_cardapio, 
            descricao, 
            imagem_capa,
            link_facebook || null,
            link_instagram || null,
            link_site_pessoal || null
        ]);
        res.status(201).send('Comércio cadastrado com sucesso');
    } catch (err) {
        console.error('Erro ao cadastrar comércio:', err);
        res.status(500).send('Erro ao cadastrar comércio');
    }
});

// Rota para obter todos os comércios
app.get('/comercio', async (req, res) => {
    const query = 'SELECT * FROM comercios';
    try {
        const results = await pool.query(query);
        res.json(results.rows);
    } catch (err) {
        console.error('Erro ao carregar comércios:', err);
        res.status(500).send('Erro ao carregar comércios');
    }
});

// Rota para obter um comércio específico pelo ID
app.get('/comercio/:id', async (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM comercios WHERE id = $1';
    try {
        const result = await pool.query(query, [id]);
        if (result.rows.length === 0) {
            return res.status(404).send('Comércio não encontrado');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao carregar comércio:', err);
        res.status(500).send('Erro ao carregar comércio');
    }
});

// Rota para atualizar um comércio
app.put('/comercio/:id', async (req, res) => {
    const { id } = req.params;
    const { 
        nome, 
        categoria, 
        cidade, 
        estado, 
        telefone, 
        horario_funcionamento, 
        horario_funcionamento_feriados, 
        link_cardapio, 
        descricao, 
        imagem_capa,
        link_facebook,
        link_instagram,
        link_site_pessoal
    } = req.body;

    // Validação da categoria
    if (!categoriasPermitidas.includes(categoria)) {
        return res.status(400).send('Categoria inválida');
    }

    const query = `
        UPDATE comercios 
        SET nome = $1, categoria = $2, cidade = $3, estado = $4, telefone = $5, 
        horario_funcionamento = $6, horario_funcionamento_feriados = $7, 
        link_cardapio = $8, descricao = $9, imagem_capa = $10, 
        link_facebook = $11, link_instagram = $12, 
        link_site_pessoal = $13 
        WHERE id = $14`;

    try {
        await pool.query(query, [
            nome, 
            categoria, 
            cidade, 
            estado, 
            telefone, 
            horario_funcionamento, 
            horario_funcionamento_feriados, 
            link_cardapio, 
            descricao, 
            imagem_capa, 
            link_facebook || null, 
            link_instagram || null, 
            link_site_pessoal || null, 
            id
        ]);
        res.send('Comércio atualizado com sucesso');
    } catch (err) {
        console.error('Erro ao atualizar comércio:', err);
        res.status(500).send('Erro ao atualizar comércio');
    }
});

// Rota para registrar um clique
app.post('/clique', async (req, res) => {
    const { comercio_id, link } = req.body;
    console.log('Clique recebido:', { comercio_id, link });

    const query = `
        INSERT INTO cliques (comercio_id, link) 
        VALUES ($1, $2)`;

    try {
        await pool.query(query, [comercio_id, link]);
        res.status(201).send('Clique registrado com sucesso');
    } catch (err) {
        console.error('Erro ao registrar clique:', err);
        res.status(500).send('Erro ao registrar clique');
    }
});

// Rota para obter cliques por comércio
app.get('/cliques/:comercio_id', async (req, res) => {
    const { comercio_id } = req.params;
    const query = `
        SELECT link, COUNT(*) AS total_cliques 
        FROM cliques 
        WHERE comercio_id = $1 
        GROUP BY link`;

    try {
        const result = await pool.query(query, [comercio_id]);
        res.json(result.rows);
    } catch (err) {
        console.error('Erro ao carregar cliques:', err);
        res.status(500).send('Erro ao carregar cliques');
    }
});

// Rota para excluir um comércio
app.delete('/comercio/:id', async (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM comercios WHERE id = $1';
    try {
        await pool.query(query, [id]);
        res.send('Comércio excluído com sucesso');
    } catch (err) {
        console.error('Erro ao excluir comércio:', err);
        res.status(500).send('Erro ao excluir comércio');
    }
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
