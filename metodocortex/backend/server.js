require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Importar rotas
const authRoutes = require('./routes/authRoutes');
const contentRoutes = require('./routes/contentRoutes');
const webhookRoutes = require('./routes/webhookRoutes');

const app = express();

// Conectar ao banco de dados
connectDB();

// Middleware
app.use(cors({
    origin: '*', // Permitir todas as origens para desenvolvimento
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware de log para desenvolvimento
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/webhook', webhookRoutes);

// Rota de teste
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Backend do Curso "Acabe com a Procrastinação" está funcionando!',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            content: '/api/content',
            webhook: '/api/webhook'
        }
    });
});

// Rota de status da API
app.get('/api/status', (req, res) => {
    res.json({
        success: true,
        message: 'API está online',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
    console.error('Erro não tratado:', err);
    res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Algo deu errado'
    });
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Rota não encontrada'
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📱 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log(`📊 Status: http://localhost:${PORT}/api/status`);
});

