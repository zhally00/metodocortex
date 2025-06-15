const mongoose = require('mongoose');
const Admin = require('./models/Admin');
require('dotenv').config();

// Script para criar o usuário administrador inicial
const createInitialAdmin = async () => {
    try {
        // Conectar ao MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('Conectado ao MongoDB');

        // Verificar se já existe um admin
        const existingAdmin = await Admin.findOne({ username: 'admin' });

        if (existingAdmin) {
            console.log('Administrador já existe!');
            console.log('Username: admin');
            console.log('Use a senha que você definiu anteriormente.');
            process.exit(0);
        }

        // Criar novo administrador
        const admin = new Admin({
            username: 'admin',
            password: 'admin123', // Senha padrão - ALTERE APÓS O PRIMEIRO LOGIN
            role: 'admin'
        });

        await admin.save();

        console.log('✅ Administrador criado com sucesso!');
        console.log('Username: admin');
        console.log('Senha: admin123');
        console.log('⚠️  IMPORTANTE: Altere a senha após o primeiro login!');

        process.exit(0);

    } catch (error) {
        console.error('Erro ao criar administrador:', error);
        process.exit(1);
    }
};

createInitialAdmin();

