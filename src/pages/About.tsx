import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { Calendar, Clock, Users, Shield, Zap, Heart } from "lucide-react";

export default function About() {
  const features = [
    {
      icon: Calendar,
      title: "Agendamento Inteligente",
      description: "Sistema avançado que evita conflitos e otimiza sua agenda automaticamente."
    },
    {
      icon: Clock,
      title: "Gestão de Tempo",
      description: "Controle total sobre horários de funcionamento e duração de cada serviço."
    },
    {
      icon: Users,
      title: "Experiência do Cliente",
      description: "Interface simples e intuitiva para seus clientes agendarem consultas."
    },
    {
      icon: Shield,
      title: "Segurança Total",
      description: "Dados protegidos com criptografia e conformidade com a LGPD."
    },
    {
      icon: Zap,
      title: "Notificações Automáticas",
      description: "Lembretes por email para você e seus clientes, reduzindo faltas."
    },
    {
      icon: Heart,
      title: "Suporte Dedicado",
      description: "Equipe sempre pronta para ajudar você a crescer seu negócio."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-backdrop">
      <Navigation />
      
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold mb-6">
            Sobre o <span className="bg-gradient-primary bg-clip-text text-transparent">Reservo</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Somos uma plataforma completa de agendamento online, criada especialmente para 
            profissionais liberais e autônomos que querem organizar seus atendimentos de forma 
            simples e eficiente.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-16"
        >
          <Card className="glass-card">
            <div className="p-8">
              <h2 className="text-2xl font-semibold mb-6 text-center">Nossa Missão</h2>
              <p className="text-lg text-muted-foreground text-center leading-relaxed">
                Democratizar o acesso a ferramentas profissionais de agendamento, 
                permitindo que qualquer profissional possa organizar seu negócio de forma 
                eficiente, sem complicações técnicas ou custos elevados.
              </p>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-12">
            Por que escolher o Reservo?
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.6 }}
                whileHover={{ y: -5 }}
              >
                <Card className="glass-card h-full">
                  <div className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <Card className="glass-card">
            <div className="p-8 text-center">
              <h2 className="text-2xl font-semibold mb-6">Nossos Números</h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">500+</div>
                  <div className="text-muted-foreground">Profissionais Ativos</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">10.000+</div>
                  <div className="text-muted-foreground">Agendamentos Realizados</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">99.8%</div>
                  <div className="text-muted-foreground">Tempo de Atividade</div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}