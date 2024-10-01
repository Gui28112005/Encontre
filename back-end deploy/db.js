const { Pool } = require('pg');

const pool = new Pool({
    connectionString: 'postgresql://postgres.boyoucdjmyudjljjbvrl:@Tonystark19@aws-0-sa-east-1.pooler.supabase.com:6543/postgres', // substitua com a URL de conexão fornecida pelo Supabase
    ssl: {
        rejectUnauthorized: false
    }
});

pool.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao Supabase:', err);
        return;
    }
    console.log('Conectado ao Supabase');
});

module.exports = pool;
