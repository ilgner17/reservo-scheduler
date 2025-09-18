import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import logoImage from "@/assets/logo.png";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const { error } = await signIn(formData.email, formData.password);
    
    if (!error) {
      navigate('/dashboard');
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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-backdrop">
        <div className="absolute inset-0 bg-gradient-hero opacity-5 animate-gradient-shift" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary-glow/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "-2s" }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div 
                className="flex items-center justify-center space-x-3 mb-6"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <img 
                  src={logoImage} 
                  alt="Reservo Logo" 
                  className="h-10 w-10 object-contain"
                />
                <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Reservo
                </span>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-3xl font-bold mb-2"
              >
                Bem-vindo de volta
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-muted-foreground"
              >
                Entre na sua conta para gerenciar seus agendamentos
              </motion.p>
            </div>

            {/* Login Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <Card className="glass-card">
                <div className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
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
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={handleChange}
                          className="pl-10 pr-10"
                          required
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

                    <div className="flex items-center justify-between">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded border-border" />
                        <span className="text-sm text-muted-foreground">Lembrar de mim</span>
                      </label>
                      <Link 
                        to="/forgot-password" 
                        className="text-sm text-primary hover:text-primary-dark transition-colors"
                      >
                        Esqueci minha senha
                      </Link>
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
                          Entrar
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </form>

                  <div className="mt-6">
                    <Separator className="my-4" />
                    <p className="text-center text-sm text-muted-foreground">
                      Não tem uma conta?{" "}
                      <Link 
                        to="/signup" 
                        className="text-primary hover:text-primary-dark font-medium transition-colors"
                      >
                        Cadastre-se gratuitamente
                      </Link>
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-center mt-8"
            >
              <p className="text-sm text-muted-foreground mb-4">
                Mais de 500 profissionais confiam no Reservo
              </p>
              <div className="flex justify-center items-center space-x-4 opacity-60">
                <div className="w-8 h-8 bg-gradient-primary rounded-full"></div>
                <div className="w-8 h-8 bg-gradient-primary rounded-full"></div>
                <div className="w-8 h-8 bg-gradient-primary rounded-full"></div>
                <div className="w-8 h-8 bg-gradient-primary rounded-full"></div>
                <div className="w-8 h-8 bg-gradient-primary rounded-full"></div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}