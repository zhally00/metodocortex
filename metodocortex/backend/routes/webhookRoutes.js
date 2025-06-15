const express = require('express');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');

const router = express.Router();

// Configurar o transportador de email
const createEmailTransporter = () => {
    return nodemailer.createTransporter({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false, // true para 465, false para outras portas
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};

// Função para gerar senha aleatória
const generateRandomPassword = (length = 8) => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
};

// Função para enviar email de boas-vindas
const sendWelcomeEmail = async (email, password) => {
    try {
        const transporter = createEmailTransporter();

        const mailOptions = {
            from: `"Acabe com a Procrastinação" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: '🎉 Bem-vindo ao Curso "Acabe com a Procrastinação"!',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
                    <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                        <h1 style="color: #2c3e50; text-align: center; margin-bottom: 30px;">
                            🎉 Parabéns pela sua compra!
                        </h1>
                        
                        <p style="font-size: 16px; line-height: 1.6; color: #333;">
                            Olá! Seja muito bem-vindo(a) ao curso <strong>"Acabe com a Procrastinação"</strong>!
                        </p>
                        
                        <p style="font-size: 16px; line-height: 1.6; color: #333;">
                            Sua conta foi criada com sucesso e você já pode acessar todo o conteúdo do curso.
                        </p>
                        
                        <div style="background-color: #ecf0f1; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="color: #2c3e50; margin-top: 0;">📧 Seus dados de acesso:</h3>
                            <p style="margin: 10px 0;"><strong>Email:</strong> ${email}</p>
                            <p style="margin: 10px 0;"><strong>Senha:</strong> ${password}</p>
                        </div>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${process.env.FRONTEND_URL}/login" 
                               style="background-color: #3498db; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                                🚀 Acessar o Curso Agora
                            </a>
                        </div>
                        
                        <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <p style="margin: 0; color: #856404;">
                                <strong>💡 Dica de Segurança:</strong> Recomendamos que você altere sua senha após o primeiro login para uma senha de sua preferência.
                            </p>
                        </div>
                        
                        <h3 style="color: #2c3e50;">📚 O que você encontrará no curso:</h3>
                        <ul style="color: #333; line-height: 1.6;">
                            <li>Módulo 1: Fundamentos para vencer a procrastinação</li>
                            <li>Módulo 2: Técnicas avançadas de produtividade</li>
                            <li>Módulo 3: Criando hábitos duradouros</li>
                            <li>E-book exclusivo com resumos e exercícios</li>
                            <li>Vídeos bônus com dicas extras</li>
                        </ul>
                        
                        <p style="font-size: 16px; line-height: 1.6; color: #333; margin-top: 30px;">
                            Estamos muito felizes em tê-lo(a) conosco nesta jornada de transformação!
                        </p>
                        
                        <p style="font-size: 16px; line-height: 1.6; color: #333;">
                            Se tiver alguma dúvida, entre em contato conosco em: 
                            <a href="mailto:${process.env.EMAIL_USER}" style="color: #3498db;">${process.env.EMAIL_USER}</a>
                        </p>
                        
                        <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ecf0f1;">
                            <p style="color: #7f8c8d; font-size: 14px;">
                                Equipe Acabe com a Procrastinação<br>
                                <em>Transformando vidas, um hábito de cada vez</em>
                            </p>
                        </div>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email de boas-vindas enviado para: ${email}`);
        return true;
    } catch (error) {
        console.error('Erro ao enviar email:', error);
        return false;
    }
};

// @route   POST /api/webhook/kirvano
// @desc    Webhook para processar pagamentos da Kirvano
// @access  Public
router.post('/kirvano', async (req, res) => {
    try {
        console.log('Webhook Kirvano recebido:', req.body);

        // Extrair dados do webhook da Kirvano
        // Nota: Ajuste os campos conforme a estrutura real do webhook da Kirvano
        const { 
            email, 
            customer_email, 
            buyer_email,
            status,
            payment_status 
        } = req.body;

        // Determinar o email do cliente (diferentes possíveis campos)
        const customerEmail = email || customer_email || buyer_email;

        if (!customerEmail) {
            console.error('Email do cliente não encontrado no webhook');
            return res.status(400).json({
                success: false,
                message: 'Email do cliente é obrigatório'
            });
        }

        // Verificar se o pagamento foi aprovado
        const isPaymentApproved = status === 'approved' || 
                                 status === 'paid' || 
                                 payment_status === 'approved' ||
                                 payment_status === 'paid';

        if (!isPaymentApproved) {
            console.log(`Pagamento não aprovado para ${customerEmail}. Status: ${status || payment_status}`);
            return res.status(200).json({
                success: true,
                message: 'Webhook processado - pagamento pendente'
            });
        }

        // Verificar se o usuário já existe
        const existingUser = await User.findOne({ email: customerEmail.toLowerCase() });
        
        if (existingUser) {
            console.log(`Usuário já existe: ${customerEmail}`);
            return res.status(200).json({
                success: true,
                message: 'Usuário já existe'
            });
        }

        // Gerar senha aleatória
        const randomPassword = generateRandomPassword(10);

        // Criar novo usuário
        const newUser = new User({
            email: customerEmail.toLowerCase(),
            password: randomPassword
        });

        await newUser.save();
        console.log(`Novo usuário criado: ${customerEmail}`);

        // Enviar email de boas-vindas
        const emailSent = await sendWelcomeEmail(customerEmail, randomPassword);

        if (!emailSent) {
            console.error(`Falha ao enviar email para: ${customerEmail}`);
            // Não retornar erro para não afetar o webhook
        }

        // Responder à Kirvano
        res.status(200).json({
            success: true,
            message: 'Usuário criado e email enviado com sucesso',
            user: {
                email: newUser.email,
                createdAt: newUser.createdAt
            }
        });

    } catch (error) {
        console.error('Erro no webhook da Kirvano:', error);
        
        // Retornar sucesso mesmo com erro para evitar reenvios desnecessários
        res.status(200).json({
            success: false,
            message: 'Erro processado',
            error: error.message
        });
    }
});

// @route   POST /api/webhook/test-email
// @desc    Rota para testar envio de email (apenas para desenvolvimento)
// @access  Public
router.post('/test-email', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email é obrigatório'
            });
        }

        const testPassword = 'senha123';
        const emailSent = await sendWelcomeEmail(email, testPassword);

        if (emailSent) {
            res.json({
                success: true,
                message: 'Email de teste enviado com sucesso'
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Falha ao enviar email de teste'
            });
        }

    } catch (error) {
        console.error('Erro no teste de email:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

module.exports = router;

