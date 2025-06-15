const express = require('express');
const Content = require('../models/Content');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// @route   GET /api/content
// @desc    Obter conteúdo público
// @access  Public
router.get('/', async (req, res) => {
    try {
        // Procurar o documento de conteúdo único
        let content = await Content.findOne({ singleton: 'main_content' });

        // Se não existir, criar um com valores padrão
        if (!content) {
            content = new Content({
                singleton: 'main_content',
                landingPage: {
                    heroTitle: "A Paz Mental de Terminar o Que Você Começa.",
                    heroSubtitle: "Um sistema de 3 módulos para acabar com a procrastinação e conquistar seus objetivos de uma vez por todas.",
                    heroDescription: "Descubra o método comprovado que já transformou a vida de milhares de pessoas, eliminando a procrastinação e criando hábitos duradouros de produtividade.",
                    benefitsTitle: "O que você vai conquistar:",
                    benefits: [
                        {
                            title: "Eliminar a Procrastinação",
                            description: "Aprenda técnicas comprovadas para vencer a procrastinação de uma vez por todas."
                        },
                        {
                            title: "Aumentar a Produtividade",
                            description: "Desenvolva sistemas eficazes para ser mais produtivo em menos tempo."
                        },
                        {
                            title: "Criar Hábitos Duradouros",
                            description: "Construa rotinas sólidas que se mantêm no longo prazo."
                        }
                    ],
                    testimonials: [
                        {
                            name: "Maria Silva",
                            text: "Este curso mudou completamente minha relação com as tarefas. Agora consigo terminar tudo que começo!",
                            rating: 5
                        },
                        {
                            name: "João Santos",
                            text: "Finalmente encontrei um método que funciona. Recomendo para todos que lutam contra a procrastinação.",
                            rating: 5
                        }
                    ],
                    ctaTitle: "Comece sua transformação hoje",
                    ctaSubtitle: "Acesso imediato ao curso completo",
                    price: "R$ 197,00",
                    originalPrice: "R$ 497,00"
                },
                courseLinks: {
                    introVideoURL: "",
                    module1VideoURL: "",
                    module2VideoURL: "",
                    module3VideoURL: "",
                    ebookPDF_URL: "",
                    bonusVideoURL: ""
                },
                settings: {
                    siteTitle: "Acabe com a Procrastinação",
                    supportEmail: "suporte@acabecomaprocrastinacao.com",
                    socialLinks: {
                        instagram: "",
                        facebook: "",
                        youtube: ""
                    }
                }
            });
            
            await content.save();
        }

        res.json({
            success: true,
            data: content
        });

    } catch (error) {
        console.error('Erro ao obter conteúdo:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

// @route   PUT /api/content
// @desc    Atualizar conteúdo (Admin apenas)
// @access  Private/Admin
router.put('/', protect, admin, async (req, res) => {
    try {
        const updates = req.body;

        // Encontrar e atualizar o documento de conteúdo
        let content = await Content.findOne({ singleton: 'main_content' });

        if (!content) {
            // Se não existir, criar um novo
            content = new Content({ singleton: 'main_content' });
        }

        // Atualizar os campos fornecidos
        if (updates.landingPage) {
            content.landingPage = { ...content.landingPage, ...updates.landingPage };
        }

        if (updates.courseLinks) {
            content.courseLinks = { ...content.courseLinks, ...updates.courseLinks };
        }

        if (updates.settings) {
            content.settings = { ...content.settings, ...updates.settings };
        }

        // Salvar as alterações
        await content.save();

        res.json({
            success: true,
            message: 'Conteúdo atualizado com sucesso',
            data: content
        });

    } catch (error) {
        console.error('Erro ao atualizar conteúdo:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

// @route   PUT /api/content/landing-page
// @desc    Atualizar apenas conteúdo da landing page
// @access  Private/Admin
router.put('/landing-page', protect, admin, async (req, res) => {
    try {
        const landingPageUpdates = req.body;

        let content = await Content.findOne({ singleton: 'main_content' });

        if (!content) {
            content = new Content({ singleton: 'main_content' });
        }

        // Atualizar apenas a landing page
        content.landingPage = { ...content.landingPage, ...landingPageUpdates };
        await content.save();

        res.json({
            success: true,
            message: 'Landing page atualizada com sucesso',
            data: content.landingPage
        });

    } catch (error) {
        console.error('Erro ao atualizar landing page:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

// @route   PUT /api/content/course-links
// @desc    Atualizar apenas links do curso
// @access  Private/Admin
router.put('/course-links', protect, admin, async (req, res) => {
    try {
        const courseLinksUpdates = req.body;

        let content = await Content.findOne({ singleton: 'main_content' });

        if (!content) {
            content = new Content({ singleton: 'main_content' });
        }

        // Atualizar apenas os links do curso
        content.courseLinks = { ...content.courseLinks, ...courseLinksUpdates };
        await content.save();

        res.json({
            success: true,
            message: 'Links do curso atualizados com sucesso',
            data: content.courseLinks
        });

    } catch (error) {
        console.error('Erro ao atualizar links do curso:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

// @route   PUT /api/content/settings
// @desc    Atualizar configurações gerais
// @access  Private/Admin
router.put('/settings', protect, admin, async (req, res) => {
    try {
        const settingsUpdates = req.body;

        let content = await Content.findOne({ singleton: 'main_content' });

        if (!content) {
            content = new Content({ singleton: 'main_content' });
        }

        // Atualizar apenas as configurações
        content.settings = { ...content.settings, ...settingsUpdates };
        await content.save();

        res.json({
            success: true,
            message: 'Configurações atualizadas com sucesso',
            data: content.settings
        });

    } catch (error) {
        console.error('Erro ao atualizar configurações:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

module.exports = router;

