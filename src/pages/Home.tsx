import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <Navigation variant="landing" isAuthenticated={!!user} />
      
      {/* Hero Section */}
      <Hero />
      
      {/* Features Section Placeholder */}
      <section id="features" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Recursos <span className="bg-gradient-primary bg-clip-text text-transparent">Poderosos</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tudo que você precisa para transformar seu negócio em uma máquina de agendamentos
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Preços <span className="bg-gradient-primary bg-clip-text text-transparent">Transparentes</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Escolha o plano ideal para o seu negócio
            </p>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="glass-card hover:shadow-hover transition-all duration-300"
            >
              <div className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">Gratuito</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-primary">R$ 0</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                    Até 5 agendamentos por mês
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                    Calendário básico
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                    Notificações por email
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                    Link personalizado
                  </li>
                </ul>
                <Button variant="outline" className="w-full" onClick={() => window.location.href = '/signup'}>
                  Começar Grátis
                </Button>
              </div>
            </motion.div>

            {/* Professional Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="glass-card hover:shadow-hover transition-all duration-300 ring-2 ring-primary shadow-glow scale-105"
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                  Mais Popular
                </span>
              </div>
              <div className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">Profissional</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-primary">R$ 19,90</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                    Até 30 agendamentos por mês
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                    Pagamentos integrados (PIX + Cartão)
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                    Relatórios básicos
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                    Suporte prioritário
                  </li>
                </ul>
                <Button 
                  className="w-full btn-glow btn-3d"
                  onClick={() => window.open('https://buy.stripe.com/test_14A6oH5YbfE614RgBra7C02', '_blank')}
                >
                  Assinar Agora
                </Button>
              </div>
            </motion.div>

            {/* Premium Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="glass-card hover:shadow-hover transition-all duration-300"
            >
              <div className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">Premium</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-primary">R$ 37,90</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                    Agendamentos ilimitados
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                    Todos os métodos de pagamento
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                    Relatórios avançados
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                    WhatsApp integrado
                  </li>
                </ul>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.open('https://buy.stripe.com/test_cNi4gzeuH77A7tf4SJa7C01', '_blank')}
                >
                  Assinar Premium
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="bg-foreground text-background py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg"></div>
                <span className="text-xl font-bold">Reservo</span>
              </div>
              <p className="text-background/70">
                Agendamentos inteligentes para profissionais modernos.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-background/70">
                <li><a href="#" className="hover:text-background transition-colors">Recursos</a></li>
                <li><a href="#" className="hover:text-background transition-colors">Preços</a></li>
                <li><a href="#" className="hover:text-background transition-colors">Integrações</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-background/70">
                <li><a href="#" className="hover:text-background transition-colors">Documentação</a></li>
                <li><a href="#" className="hover:text-background transition-colors">Contato</a></li>
                <li><a href="#" className="hover:text-background transition-colors">Status</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-background/70">
                <li><a href="#" className="hover:text-background transition-colors">Sobre</a></li>
                <li><a href="#" className="hover:text-background transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-background transition-colors">Carreiras</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-background/20 mt-8 pt-8 text-center text-background/70">
            <p>&copy; 2025 Reservo. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}