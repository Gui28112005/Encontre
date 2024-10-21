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
    'cinema',
    'mecanica',
    'Seguros',
    'cafeteria',
    'mercado',
    'bar',
    'academia',
    'livraria',
    'pet shop',
    'serviços de beleza',
    'clube',
    'feira de artesanato',
    'centro cultural',
    'restaurante vegetariano',
    'cervejaria',
    'atelie',
    'salao de beleza',
    'farmacia',
    'estudio de fotografia',
    'casa de shows',
    'escola de musica',
    'clinica de estetica',
    'estudio de yoga',
    'espaco coworking',
    'centro esportivo',
    'loja de roupas',
    'loja de brinquedos',
    'cafeteria vegana',
    'empreendimentos sustentaveis',
    'loja de moveis',
    'agencia de viagens',
    'terapias alternativas',
    'pousadas e hoteis'
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
    const query = `
        SELECT c.*, 
               COALESCE(a.total, 0) AS total_avaliacoes 
        FROM comercios c
        LEFT JOIN (
            SELECT comercio_id, COUNT(*) AS total 
            FROM avaliacoes 
            GROUP BY comercio_id
        ) a ON c.id = a.comercio_id`;

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
    const query = 'SELECT *, created_at FROM comercios WHERE id = $1'; // Incluindo created_at
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

// Rota para criar uma nova avaliação
app.post('/avaliacao', async (req, res) => {
    const { comercio_id, avaliacao } = req.body;

    // Validação da avaliação
    if (!['bom', 'ruim', 'amei'].includes(avaliacao)) {
        return res.status(400).send('Avaliação inválida');
    }

    const query = `
        INSERT INTO avaliacoes (comercio_id, avaliacao) 
        VALUES ($1, $2)`;

    try {
        await pool.query(query, [comercio_id, avaliacao]);
        res.status(201).send('Avaliação cadastrada com sucesso');
    } catch (err) {
        console.error('Erro ao cadastrar avaliação:', err);
        res.status(500).send('Erro ao cadastrar avaliação');
    }
});

// Rota para obter avaliações de um comércio
app.get('/avaliacoes/:comercio_id', async (req, res) => {
    const { comercio_id } = req.params;
    const query = `
        SELECT avaliacao, COUNT(*) AS total 
        FROM avaliacoes 
        WHERE comercio_id = $1 
        GROUP BY avaliacao`;

    try {
        const result = await pool.query(query, [comercio_id]);
        res.json(result.rows);
    } catch (err) {
        console.error('Erro ao carregar avaliações:', err);
        res.status(500).send('Erro ao carregar avaliações');
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

app.post('/afiliado/:id/comercio', async (req, res) => {
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

    // Verificar créditos do afiliado
    const verificarCreditosQuery = 'SELECT creditos FROM afiliados WHERE id = $1';
    const result = await pool.query(verificarCreditosQuery, [id]);

    if (result.rows.length === 0) {
        return res.status(404).send('Afiliado não encontrado.');
    }

    const creditos = result.rows[0].creditos;

    if (creditos <= 0) {
        return res.status(400).send('Você não tem créditos suficientes para cadastrar um comércio.');
    }

    const query = `
        INSERT INTO comercios 
        (nome, categoria, cidade, estado, telefone, horario_funcionamento, 
        horario_funcionamento_feriados, link_cardapio, descricao, imagem_capa, 
        link_facebook, link_instagram, link_site_pessoal, afiliado_id) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`;

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
            id // afiliado_id
        ]);

        // Decrementar os créditos do afiliado
        await pool.query('UPDATE afiliados SET creditos = creditos - 1 WHERE id = $1', [id]);

        res.status(201).send('Comércio cadastrado com sucesso');
    } catch (err) {
        console.error('Erro ao cadastrar comércio:', err.message);
        res.status(500).send('Erro ao cadastrar comércio');
    }
});



// Rota para cadastrar um novo afiliado
app.post('/afiliado', async (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).send('Todos os campos são obrigatórios: nome, email e senha');
    }

    const query = 'INSERT INTO afiliados (nome, email, senha, creditos) VALUES ($1, $2, $3, $4)';

    try {
        await pool.query(query, [nome, email, senha, 0]); // Começa com 0 créditos
        res.status(201).send('Afiliado cadastrado com sucesso');
    } catch (err) {
        console.error('Erro ao cadastrar afiliado:', err);
        res.status(500).send('Erro ao cadastrar afiliado');
    }
});



// Rota para login de afiliado
app.post('/afiliado/login', async (req, res) => {
    const { email, senha } = req.body;

    const query = 'SELECT * FROM afiliados WHERE email = $1 AND senha = $2';

    try {
        const result = await pool.query(query, [email, senha]);
        if (result.rows.length === 0) {
            return res.status(401).send('Email ou senha inválidos');
        }
        res.json({ message: 'Login bem-sucedido', afiliado: result.rows[0] });
    } catch (err) {
        console.error('Erro ao fazer login:', err);
        res.status(500).send('Erro ao fazer login');
    }
});


// Rota para obter todos os afiliados
app.get('/afiliados', async (req, res) => {
    const query = 'SELECT id, nome FROM afiliados';

    try {
        const results = await pool.query(query);
        res.json(results.rows);
    } catch (err) {
        console.error('Erro ao carregar afiliados:', err);
        res.status(500).send('Erro ao carregar afiliados');
    }
});

// Rota para obter todos os comercios do afiliado logado
app.get('/afiliado/:id/comercio', async (req, res) => {
    const { id } = req.params;

    // Consulta para obter apenas os comercios cadastrados pelo afiliado
    const query = 'SELECT * FROM comercios WHERE afiliado_id = $1';
    
    try {
        const result = await pool.query(query, [id]);
        res.json(result.rows);
    } catch (err) {
        console.error('Erro ao carregar comercios:', err);
        res.status(500).send('Erro ao carregar comercios');
    }
});


// Rota para adicionar créditos a um afiliado
app.post('/afiliado/:id/creditos', async (req, res) => {
    const { id } = req.params;
    const { creditos } = req.body;

    // Adicione este console.log para depuração
    console.log('ID do afiliado:', id);
    console.log('Valor de créditos recebido:', creditos);

    // Verifique se creditos é um número e maior que 0
    if (typeof creditos !== 'number' || creditos <= 0) {
        return res.status(400).send('Quantidade de créditos inválida');
    }

    const query = 'UPDATE afiliados SET creditos = creditos + $1 WHERE id = $2';

    try {
        await pool.query(query, [creditos, id]);
        res.send('Créditos adicionados com sucesso');
    } catch (err) {
        console.error('Erro ao adicionar créditos:', err);
        res.status(500).send('Erro ao adicionar créditos');
    }
});

app.post('/afiliado/:id/comercio', async (req, res) => {
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

    // Verificar créditos do afiliado
    const verificarCreditosQuery = 'SELECT creditos FROM afiliados WHERE id = $1';
    const result = await pool.query(verificarCreditosQuery, [id]);

    if (result.rows.length === 0) {
        return res.status(404).send('Afiliado não encontrado.');
    }

    const creditos = result.rows[0].creditos;

    if (creditos <= 0) {
        return res.status(400).send('Você não tem créditos suficientes para cadastrar um comércio.');
    }

    const query = `
        INSERT INTO comercios 
        (nome, categoria, cidade, estado, telefone, horario_funcionamento, 
        horario_funcionamento_feriados, link_cardapio, descricao, imagem_capa, 
        link_facebook, link_instagram, link_site_pessoal, afiliado_id) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`;

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
            id // afiliado_id
        ]);

        // Decrementar os créditos do afiliado
        await pool.query('UPDATE afiliados SET creditos = creditos - 1 WHERE id = $1', [id]);

        res.status(201).send('Comércio cadastrado com sucesso');
    } catch (err) {
        console.error('Erro ao cadastrar comércio:', err.message);
        res.status(500).send('Erro ao cadastrar comércio');
    }
});


// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
