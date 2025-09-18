import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { Check, Zap, Crown, Gift } from "lucide-react";

export default function Pricing() {
  const plans = [
    {
      name: "Gratuito",
      price: "R$ 0",
      period: "/mês",
      description: "Perfeito para começar",
      icon: Gift,
      features: [
        "Até 5 agendamentos por mês",
        "Calendário básico",
        "Notificações por email",
        "Suporte por email",
        "Link personalizado"
      ],
      limitations: ["Limitado a 5 agendamentos/mês"],
      popular: false,
      cta: "Começar Grátis",
      href: "/signup"
    },
    {
      name: "Profissional",
      price: "R$ 19,90",
      period: "/mês", 
      description: "Para profissionais em crescimento",
      icon: Zap,
      features: [
        "Até 30 agendamentos por mês",
        "Pagamentos integrados (PIX + Cartão)",
        "Relatórios básicos",
        "Notificações automáticas",
        "Suporte prioritário",
        "Personalização do perfil",
        "Backup automático"
      ],
      limitations: [],
      popular: true,
      cta: "Assinar Agora",
      href: "https://buy.stripe.com/test_14A6oH5YbfE614RgBra7C02",
      stripeProduct: "prod_T4GpTGwNDOETAP"
    },
    {
      name: "Premium",
      price: "R$ 37,90",
      period: "/mês",
      description: "Para quem quer o máximo",
      icon: Crown,
      features: [
        "Agendamentos ilimitados",
        "Todos os métodos de pagamento",
        "Relatórios avançados",
        "API para integrações",
        "Suporte 24/7",
        "Múltiplos profissionais",
        "WhatsApp integrado",
        "Análise de performance"
      ],
      limitations: [],
      popular: false,
      cta: "Assinar Premium",
      href: "https://buy.stripe.com/test_cNi4gzeuH77A7tf4SJa7C01",
      stripeProduct: "prod_T4GqLWWoqHAmVF"
    }
  ];

  const handlePlanClick = (plan: any) => {
    if (plan.href.startsWith('http')) {
      window.open(plan.href, '_blank');
    } else {
      window.location.href = plan.href;
    }
  };

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
            Escolha o plano ideal para seu <span className="bg-gradient-primary bg-clip-text text-transparent">negócio</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comece grátis e evolua conforme seu negócio cresce. Sem compromisso, cancele quando quiser.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -5 }}
              className={`relative ${plan.popular ? 'md:scale-105' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <span className="bg-gradient-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                    Mais Popular
                  </span>
                </div>
              )}

              <Card className={`glass-card h-full relative overflow-hidden ${
                plan.popular ? 'ring-2 ring-primary shadow-glow' : ''
              }`}>
                <div className="p-8">
                  <div className="flex items-center justify-center mb-6">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                      plan.popular 
                        ? 'bg-gradient-primary shadow-glow' 
                        : 'bg-muted'
                    }`}>
                      <plan.icon className={`w-8 h-8 ${
                        plan.popular ? 'text-white' : 'text-primary'
                      }`} />
                    </div>
                  </div>

                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-muted-foreground mb-4">{plan.description}</p>
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-primary">{plan.price}</span>
                      <span className="text-muted-foreground ml-1">{plan.period}</span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Check className="w-5 h-5 text-success mt-0.5 mr-3 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {plan.limitations.length > 0 && (
                    <div className="mb-6">
                      <p className="text-xs text-muted-foreground font-medium mb-2">Limitações:</p>
                      <ul className="space-y-1">
                        {plan.limitations.map((limitation, limitIndex) => (
                          <li key={limitIndex} className="text-xs text-muted-foreground">
                            • {limitation}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Button 
                    onClick={() => handlePlanClick(plan)}
                    className={`w-full ${
                      plan.popular 
                        ? 'btn-glow btn-3d' 
                        : 'variant-outline hover:bg-primary hover:text-primary-foreground'
                    }`}
                    size="lg"
                  >
                    {plan.cta}
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-muted-foreground mb-4">
            Dúvidas sobre qual plano escolher?
          </p>
          <Button variant="outline" size="lg">
            Falar com Especialista
          </Button>
        </motion.div>
      </div>
    </div>
  );
}