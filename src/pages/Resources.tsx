import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { BackButton } from "@/components/BackButton";
import { Calendar, Clock, Users, Shield, Zap, Heart, BookOpen, Video, FileText, MessageCircle } from "lucide-react";

export default function Resources() {
  const resources = [
    {
      icon: BookOpen,
      title: "Guia de Início Rápido",
      description: "Aprenda a configurar sua conta e fazer seu primeiro agendamento em poucos minutos.",
      category: "Primeiros Passos"
    },
    {
      icon: Video,
      title: "Videoaulas",
      description: "Assista tutoriais em vídeo sobre todas as funcionalidades da plataforma.",
      category: "Tutoriais"
    },
    {
      icon: FileText,
      title: "Base de Conhecimento",
      description: "Documentação completa com respostas para as perguntas mais frequentes.",
      category: "Documentação"
    },
    {
      icon: MessageCircle,
      title: "Suporte Técnico",
      description: "Entre em contato com nossa equipe especializada para ajuda personalizada.",
      category: "Suporte"
    },
    {
      icon: Calendar,
      title: "Melhores Práticas",
      description: "Dicas e estratégias para otimizar seus agendamentos e aumentar sua produtividade.",
      category: "Dicas"
    },
    {
      icon: Shield,
      title: "Segurança e Privacidade",
      description: "Saiba como protegemos seus dados e como você pode manter sua conta segura.",
      category: "Segurança"
    }
  ];

  const faqs = [
    {
      question: "Como posso personalizar meu link de agendamento?",
      answer: "Acesse as configurações da sua conta e altere o campo 'Nome de usuário'. Seu link será reservo.com/seu-usuario."
    },
    {
      question: "Posso integrar com meu Google Calendar?",
      answer: "Sim! Na seção de integrações você pode conectar sua conta do Google para sincronizar automaticamente."
    },
    {
      question: "Como funciona o sistema de pagamentos?",
      answer: "Processamos pagamentos via PIX e cartão de crédito através do Stripe, garantindo total segurança."
    },
    {
      question: "Existe limite de agendamentos?",
      answer: "Depende do seu plano. O gratuito permite 5/mês, Profissional 30/mês e Premium é ilimitado."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-backdrop">
      <Navigation variant="dashboard" />
      
      <div className="container mx-auto px-4 py-16">
        <BackButton className="mb-8" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold mb-6">
            Central de <span className="bg-gradient-primary bg-clip-text text-transparent">Recursos</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Tudo que você precisa para aproveitar ao máximo sua experiência com o Reservo.
            Guias, tutoriais e suporte para seu sucesso.
          </p>
        </motion.div>

        {/* Recursos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-12">
            Recursos Disponíveis
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resources.map((resource, index) => (
              <motion.div
                key={resource.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.6 }}
                whileHover={{ y: -5 }}
              >
                <Card className="glass-card h-full cursor-pointer hover:shadow-lg transition-all duration-300">
                  <div className="p-6">
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                      <resource.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="mb-3">
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        {resource.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold mb-3">{resource.title}</h3>
                    <p className="text-muted-foreground">{resource.description}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-center mb-12">
            Perguntas Frequentes
          </h2>
          
          <div className="max-w-4xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.6 }}
              >
                <Card className="glass-card">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-3 text-primary">
                      {faq.question}
                    </h3>
                    <p className="text-muted-foreground">
                      {faq.answer}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA de Suporte */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-center mt-16"
        >
          <Card className="glass-card">
            <div className="p-8">
              <h2 className="text-2xl font-semibold mb-4">
                Precisa de mais ajuda?
              </h2>
              <p className="text-muted-foreground mb-6">
                Nossa equipe de suporte está sempre pronta para ajudar você.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:suporte@reservo.com"
                  className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Entrar em Contato
                </a>
                <a
                  href="https://wa.me/5511999999999"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}