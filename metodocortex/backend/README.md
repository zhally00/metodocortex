# Backend do Curso "Acabe com a Procrastinação"

## 📋 Visão Geral

Este é o backend completo para a plataforma de curso online "Acabe com a Procrastinação". Foi desenvolvido usando Node.js, Express.js e MongoDB, seguindo as especificações fornecidas.

## 🚀 Funcionalidades

### ✅ Autenticação
- Login de alunos (email/senha)
- Login de administrador (username/senha)
- Autenticação via JWT (JSON Web Tokens)
- Middleware de proteção de rotas

### ✅ Sistema CMS (Content Management System)
- Gestão de conteúdo da landing page
- Edição de textos, benefícios e depoimentos
- Gestão de links de vídeos do curso
- Configurações gerais do site

### ✅ Integração com Kirvano
- Webhook para processar pagamentos
- Criação automática de contas de alunos
- Envio automático de e-mails de boas-vindas
- Geração de senhas aleatórias

### ✅ Segurança
- Hashing de senhas com bcrypt
- Tokens JWT com expiração
- Middleware de autorização
- Validação de dados de entrada

## 🛠️ Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM para MongoDB
- **bcryptjs** - Hashing de senhas
- **jsonwebtoken** - Autenticação JWT
- **nodemailer** - Envio de e-mails
- **cors** - Cross-Origin Resource Sharing
- **dotenv** - Variáveis de ambiente

## 📁 Estrutura do Projeto

```
/backend
├── /config
│   └── db.js                 # Configuração do MongoDB
├── /models
│   ├── User.js              # Schema dos alunos
│   ├── Admin.js             # Schema dos administradores
│   └── Content.js           # Schema do conteúdo CMS
├── /routes
│   ├── authRoutes.js        # Rotas de autenticação
│   ├── contentRoutes.js     # Rotas do CMS
│   └── webhookRoutes.js     # Rotas de webhook e e-mail
├── /middleware
│   └── authMiddleware.js    # Middleware de autenticação
├── .env                     # Variáveis de ambiente
├── server.js               # Arquivo principal
├── createAdmin.js          # Script para criar admin
└── package.json            # Dependências
```

## 🔧 Configuração e Instalação

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar Variáveis de Ambiente
Edite o arquivo `.env` com suas configurações:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/curso_procrastinacao
JWT_SECRET=sua_chave_secreta_super_segura_aqui_123456789
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha_de_app
FRONTEND_URL=http://localhost:3000
```

### 3. Instalar e Configurar MongoDB
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

### 4. Criar Administrador Inicial
```bash
node createAdmin.js
```
**Credenciais padrão:**
- Username: `admin`
- Senha: `admin123`

### 5. Iniciar o Servidor
```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

## 📡 Endpoints da API

### Autenticação
- `POST /api/auth/login` - Login de aluno
- `POST /api/auth/admin/login` - Login de administrador
- `POST /api/auth/register` - Registro de usuário (para testes)

### Conteúdo (CMS)
- `GET /api/content` - Obter conteúdo público
- `PUT /api/content` - Atualizar conteúdo (Admin)
- `PUT /api/content/landing-page` - Atualizar landing page (Admin)
- `PUT /api/content/course-links` - Atualizar links do curso (Admin)
- `PUT /api/content/settings` - Atualizar configurações (Admin)

### Webhook
- `POST /api/webhook/kirvano` - Webhook da Kirvano
- `POST /api/webhook/test-email` - Teste de envio de e-mail

### Utilitários
- `GET /` - Informações da API
- `GET /api/status` - Status da API

## 🔐 Autenticação

### Login de Aluno
```javascript
POST /api/auth/login
Content-Type: application/json

{
  "email": "aluno@exemplo.com",
  "password": "senha123"
}
```

### Login de Admin
```javascript
POST /api/auth/admin/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

### Usar Token JWT
```javascript
Authorization: Bearer SEU_TOKEN_JWT_AQUI
```

## 📧 Configuração de E-mail

Para o envio de e-mails funcionar, configure:

1. **Gmail**: Use uma senha de app
2. **Outros provedores**: Ajuste as configurações SMTP no `.env`

### Exemplo de configuração Gmail:
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seuemail@gmail.com
EMAIL_PASS=sua_senha_de_app_do_gmail
```

## 🔗 Integração com Kirvano

O webhook `/api/webhook/kirvano` processa automaticamente:

1. **Recebe** notificação de pagamento
2. **Extrai** o e-mail do cliente
3. **Gera** senha aleatória
4. **Cria** conta do aluno
5. **Envia** e-mail de boas-vindas

### Estrutura esperada do webhook:
```javascript
{
  "email": "cliente@exemplo.com",
  "status": "approved"
  // outros campos da Kirvano
}
```

## 🧪 Testes

### Testar API
```bash
# Verificar se a API está online
curl http://localhost:5000/api/status

# Obter conteúdo público
curl http://localhost:5000/api/content

# Testar envio de e-mail
curl -X POST http://localhost:5000/api/webhook/test-email \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@exemplo.com"}'
```

## 🚀 Deploy

### Variáveis de Ambiente para Produção
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=sua_string_de_conexao_mongodb_atlas
JWT_SECRET=chave_secreta_muito_forte_para_producao
EMAIL_HOST=seu_provedor_smtp
EMAIL_USER=seu_email_de_producao
EMAIL_PASS=sua_senha_de_producao
FRONTEND_URL=https://seudominio.com
```

### Comandos de Deploy
```bash
# Instalar dependências
npm install --production

# Criar admin (se necessário)
node createAdmin.js

# Iniciar em produção
npm start
```

## 📝 Notas Importantes

1. **Segurança**: Altere a senha do admin após o primeiro login
2. **JWT Secret**: Use uma chave forte em produção
3. **MongoDB**: Configure backup regular dos dados
4. **E-mail**: Teste o envio de e-mails antes do deploy
5. **CORS**: Ajuste as origens permitidas para produção

## 🐛 Solução de Problemas

### Erro de Conexão MongoDB
```bash
# Verificar se o MongoDB está rodando
sudo systemctl status mongod

# Reiniciar MongoDB
sudo systemctl restart mongod
```

### Erro de Porta em Uso
```bash
# Encontrar processo usando a porta
lsof -i :5000

# Matar processo
kill -9 PID_DO_PROCESSO
```

### Problemas com E-mail
1. Verifique as credenciais SMTP
2. Para Gmail, use senha de app
3. Verifique se o firewall permite conexões SMTP

## 📞 Suporte

Para dúvidas ou problemas:
- Verifique os logs do servidor
- Consulte a documentação das dependências
- Teste as rotas individualmente

---

**Desenvolvido com ❤️ para o curso "Acabe com a Procrastinação"**

