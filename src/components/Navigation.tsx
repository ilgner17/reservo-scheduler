import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X, Calendar, User, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import logoImage from "@/assets/logo.png";

interface NavigationProps {
  isAuthenticated?: boolean;
  variant?: "landing" | "dashboard";
}

export function Navigation({ isAuthenticated = false, variant = "landing" }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const landingItems = [
    { label: "Sobre", href: "/about" },
    { label: "Recursos", href: "#features" },
    { label: "Preços", href: "#pricing" },
  ];

  const dashboardItems = [
    { label: "Dashboard", href: "/dashboard", icon: Calendar },
    { label: "Novo Agendamento", href: "/new-booking", icon: Calendar },
    { label: "Configurações", href: "/settings", icon: Settings },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "fixed top-0 left-0 right-0 z-40 glass border-b border-card-border",
        variant === "dashboard" && "bg-background/95"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-12">
          {/* Logo */}
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <img 
              src="/src/assets/reservo-logo.png" 
              alt="Reservo Logo" 
              className="h-8 w-8 object-contain"
            />
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {variant === "landing" ? (
              <>
                {landingItems.map((item) => (
                  <motion.a
                    key={item.label}
                    href={item.href === "#features" ? "#features" : item.href === "#pricing" ? "#pricing" : item.href}
                    className="text-muted-foreground hover:text-foreground transition-colors relative group"
                    whileHover={{ y: -2 }}
                    transition={{ type: "spring", stiffness: 400 }}
                    onClick={(e) => {
                      if (item.href === "#features" || item.href === "#pricing") {
                        e.preventDefault();
                        const element = document.querySelector(item.href);
                        element?.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    {item.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300" />
                  </motion.a>
                ))}
                {!isAuthenticated ? (
                  <div className="flex items-center space-x-3">
                    <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                      Entrar
                    </Button>
                    <Button size="sm" className="btn-glow btn-3d" onClick={() => navigate('/signup')}>
                      Começar Grátis
                    </Button>
                  </div>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
                    Dashboard
                  </Button>
                )}
              </>
            ) : (
              <>
                {dashboardItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <motion.a
                      key={item.label}
                      href={item.href}
                      className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </motion.a>
                  );
                })}
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={signOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-t border-card-border bg-background/95 backdrop-blur-xl"
          >
            <div className="px-4 py-4 space-y-3">
              {variant === "landing" ? (
                <>
                  {landingItems.map((item) => (
                    <a
                      key={item.label}
                      href={item.href === "#features" ? "#features" : item.href === "#pricing" ? "#pricing" : item.href}
                      className="block py-2 text-muted-foreground hover:text-foreground transition-colors"
                      onClick={(e) => {
                        setIsMobileMenuOpen(false);
                        if (item.href === "#features" || item.href === "#pricing") {
                          e.preventDefault();
                          const element = document.querySelector(item.href);
                          element?.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                    >
                      {item.label}
                    </a>
                  ))}
                  {!isAuthenticated && (
                    <div className="pt-3 space-y-2">
                      <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => navigate('/login')}>
                        Entrar
                      </Button>
                      <Button size="sm" className="w-full" onClick={() => navigate('/signup')}>
                        Começar Grátis
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {dashboardItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <a
                        key={item.label}
                        href={item.href}
                        className="flex items-center space-x-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </a>
                    );
                  })}
                  <Button variant="ghost" size="sm" className="w-full justify-start text-destructive hover:text-destructive mt-4" onClick={signOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}