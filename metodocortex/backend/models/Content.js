const mongoose = require('mongoose');

const ContentSchema = new mongoose.Schema({
    // Identificador único para garantir que há apenas um documento de conteúdo
    singleton: { 
        type: String, 
        default: 'main_content', 
        unique: true 
    }, 
    
    // Conteúdo da Landing Page
    landingPage: {
        heroTitle: { 
            type: String, 
            default: "A Paz Mental de Terminar o Que Você Começa." 
        },
        heroSubtitle: { 
            type: String, 
            default: "Um sistema de 3 módulos para acabar com a procrastinação e conquistar seus objetivos de uma vez por todas." 
        },
        heroDescription: {
            type: String,
            default: "Descubra o método comprovado que já transformou a vida de milhares de pessoas, eliminando a procrastinação e criando hábitos duradouros de produtividade."
        },
        benefitsTitle: {
            type: String,
            default: "O que você vai conquistar:"
        },
        benefits: [{
            title: String,
            description: String
        }],
        testimonials: [{
            name: String,
            text: String,
            rating: Number
        }],
        ctaTitle: {
            type: String,
            default: "Comece sua transformação hoje"
        },
        ctaSubtitle: {
            type: String,
            default: "Acesso imediato ao curso completo"
        },
        price: {
            type: String,
            default: "R$ 197,00"
        },
        originalPrice: {
            type: String,
            default: "R$ 497,00"
        }
    },
    
    // Links dos vídeos do curso
    courseLinks: {
        introVideoURL: { 
            type: String, 
            default: "" 
        },
        module1VideoURL: { 
            type: String, 
            default: "" 
        },
        module2VideoURL: { 
            type: String, 
            default: "" 
        },
        module3VideoURL: { 
            type: String, 
            default: "" 
        },
        ebookPDF_URL: { 
            type: String, 
            default: "" 
        },
        bonusVideoURL: {
            type: String,
            default: ""
        }
    },

    // Configurações gerais
    settings: {
        siteTitle: {
            type: String,
            default: "Acabe com a Procrastinação"
        },
        supportEmail: {
            type: String,
            default: "suporte@acabecomaprocrastinacao.com"
        },
        socialLinks: {
            instagram: String,
            facebook: String,
            youtube: String
        }
    },

    updatedAt: { 
        type: Date, 
        default: Date.now 
    }
});

// Middleware para atualizar o campo updatedAt
ContentSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Content', ContentSchema);

