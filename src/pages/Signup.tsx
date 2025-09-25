import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Check } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { BackButton } from "@/components/BackButton";
import reservoLogo from "@/assets/reservo-logo.png";

const plans = [
  {
    name: "Starter",
    price: "Grátis",
    period: "para sempre",
    features: ["Até 50 agendamentos/mês", "Calendário básico", "Suporte por email"],
    popular: false
  },
  {
    name: "Pro",
    price: "R$ 29",
    period: "/mês",
    features: ["Agendamentos ilimitados", "Pagamentos integrados", "Relatórios avançados", "Suporte prioritário"],
    popular: true
  }
];

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("starter");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profession: ""
  });

  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const { error } = await signUp(formData.email, formData.password, formData.name, formData.profession);
    
    if (!error) {
      navigate('/login');
    }
    
    setIsLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-8">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-backdrop">
        <div className="absolute inset-0 bg-gradient-hero opacity-5 animate-gradient-shift" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary-glow/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "-2s" }} />
      </div>

      {/* Back Button */}
      <div className="absolute top-4 left-4 z-20">
        <BackButton />
      </div>

      <div className="container mx-auto px-4 relative z-10 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div 
              className="flex items-center justify-center mb-6"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <img 
                src={reservoLogo} 
                alt="Reserva Logo" 
                className="h-24 w-24 object-cover rounded-xl shadow-lg"
              />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-3xl font-bold mb-2"
            >
              Comece sua <span className="bg-gradient-primary bg-clip-text text-transparent">jornada</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-muted-foreground"
            >
              Crie sua conta e transforme a forma como você gerencia agendamentos
            </motion.p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Signup Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <Card className="glass-card">
                <div className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome completo</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Seu nome"
                            value={formData.name}
                            onChange={handleChange}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="profession">Profissão</Label>
                        <Input
                          id="profession"
                          name="profession"
                          type="text"
                          placeholder="Ex: Psicólogo, Nutricionista"
                          value={formData.profession}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email profissional</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="seu@email.com"
                          value={formData.email}
                          onChange={handleChange}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Senha</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Mínimo 8 caracteres"
                          value={formData.password}
                          onChange={handleChange}
                          className="pl-10 pr-10"
                          required
                          minLength={8}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <input type="checkbox" className="rounded border-border mt-1" required />
                      <span className="text-sm text-muted-foreground">
                        Concordo com os{" "}
                        <Link to="/terms" className="text-primary hover:text-primary-dark">
                          Termos de Uso
                        </Link>{" "}
                        e{" "}
                        <Link to="/privacy" className="text-primary hover:text-primary-dark">
                          Política de Privacidade
                        </Link>
                      </span>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full btn-glow btn-3d" 
                      size="lg"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          Criar Conta Gratuita
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </form>

                  <div className="mt-6">
                    <Separator className="my-4" />
                    <p className="text-center text-sm text-muted-foreground">
                      Já tem uma conta?{" "}
                      <Link 
                        to="/login" 
                        className="text-primary hover:text-primary-dark font-medium transition-colors"
                      >
                        Faça login
                      </Link>
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Plans */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-center mb-6">Escolha seu plano</h3>
              
              {plans.map((plan) => (
                <motion.div
                  key={plan.name}
                  whileHover={{ scale: 1.02, y: -2 }}
                  transition={{ type: "spring", stiffness: 400 }}
                  className={`glass-card cursor-pointer transition-all duration-300 ${
                    selectedPlan === plan.name.toLowerCase() 
                      ? "ring-2 ring-primary shadow-glow" 
                      : "hover:shadow-hover"
                  } ${plan.popular ? "relative" : ""}`}
                  onClick={() => setSelectedPlan(plan.name.toLowerCase())}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
                        Mais Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold">{plan.name}</h4>
                        <div className="flex items-baseline">
                          <span className="text-2xl font-bold text-primary">{plan.price}</span>
                          <span className="text-sm text-muted-foreground ml-1">{plan.period}</span>
                        </div>
                      </div>
                      
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedPlan === plan.name.toLowerCase() 
                          ? "border-primary bg-primary" 
                          : "border-muted-foreground"
                      }`}>
                        {selectedPlan === plan.name.toLowerCase() && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                    </div>
                    
                    <ul className="space-y-2">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center text-sm">
                          <Check className="w-4 h-4 text-success mr-2 flex-shrink-0" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}