const jwt = require('jsonwebtoken');

// Middleware para proteger rotas
const protect = async (req, res, next) => {
    let token;

    // Verificar se o token existe no header Authorization
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extrair o token
            token = req.headers.authorization.split(' ')[1];

            // Verificar o token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Adicionar o usuário ao request
            req.user = decoded;
            
            next();
        } catch (error) {
            console.error('Erro na verificação do token:', error);
            return res.status(401).json({ 
                success: false, 
                message: 'Token inválido' 
            });
        }
    }

    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: 'Acesso negado. Token não fornecido.' 
        });
    }
};

// Middleware para verificar se é admin
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ 
            success: false, 
            message: 'Acesso negado. Privilégios de administrador necessários.' 
        });
    }
};

module.exports = { protect, admin };

