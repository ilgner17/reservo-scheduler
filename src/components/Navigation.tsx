import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X, Calendar, User, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import logoImage from "@/assets/logo.png";

interface NavigationProps {
  isAuthenticated?: boolean;
  variant?: "landing" | "dashboard";
}

export function Navigation({ isAuthenticated = false, variant = "landing" }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const landingItems = [
    { label: "Recursos", href: "#features" },
    { label: "Preços", href: "#pricing" },
    { label: "Contato", href: "#contact" },
  ];

  const dashboardItems = [
    { label: "Dashboard", href: "/dashboard", icon: Calendar },
    { label: "Perfil", href: "/profile", icon: User },
    { label: "Configurações", href: "/settings", icon: Settings },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 glass border-b border-card-border",
        variant === "dashboard" && "bg-background/95"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <img 
              src={logoImage} 
              alt="Reservo Logo" 
              className="h-8 w-8 object-contain"
            />
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Reservo
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {variant === "landing" ? (
              <>
                {landingItems.map((item) => (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground transition-colors relative group"
                    whileHover={{ y: -2 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    {item.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300" />
                  </motion.a>
                ))}
                {!isAuthenticated ? (
                  <div className="flex items-center space-x-3">
                    <Button variant="ghost" size="sm">
                      Entrar
                    </Button>
                    <Button size="sm" className="btn-glow btn-3d">
                      Começar Grátis
                    </Button>
                  </div>
                ) : (
                  <Button variant="outline" size="sm">
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
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
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
                      href={item.href}
                      className="block py-2 text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </a>
                  ))}
                  {!isAuthenticated && (
                    <div className="pt-3 space-y-2">
                      <Button variant="ghost" size="sm" className="w-full justify-start">
                        Entrar
                      </Button>
                      <Button size="sm" className="w-full">
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
                  <Button variant="ghost" size="sm" className="w-full justify-start text-destructive hover:text-destructive mt-4">
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