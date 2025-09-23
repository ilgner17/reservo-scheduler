import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { BackButton } from "@/components/BackButton";
import { CheckCircle, ArrowRight } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function CheckoutSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      // Process the checkout session
      fetch('/api/checkout/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId })
      }).then(() => {
        // Redirect to dashboard after processing
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      });
    }
  }, [sessionId, navigate]);

  return (
    <div className="min-h-screen bg-gradient-backdrop">
      <Navigation variant="dashboard" />
      
      <div className="container mx-auto px-4 pt-20 pb-8">
        <BackButton className="mb-4" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md mx-auto text-center"
        >
          <Card className="glass-card p-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
              className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-8 h-8 text-success" />
            </motion.div>
            
            <h1 className="text-2xl font-bold mb-4">Pagamento Confirmado!</h1>
            <p className="text-muted-foreground mb-6">
              Seu plano foi ativado com sucesso. Você será redirecionado para o dashboard em alguns segundos.
            </p>
            
            <Button 
              onClick={() => navigate('/dashboard')}
              className="w-full btn-glow"
            >
              Ir para Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}