import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BackButton } from "@/components/BackButton";
import { Navigation } from "@/components/Navigation";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Send, CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function TestWebhook() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [lastResult, setLastResult] = useState<any>(null);

  const handleTestWebhook = async () => {
    setLoading(true);
    setLastResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('test-webhook');

      if (error) throw error;

      setLastResult(data);
      
      if (data.success) {
        toast({
          title: "✅ Webhook testado com sucesso!",
          description: "O N8N recebeu a mensagem de teste. Verifique o WhatsApp.",
        });
      } else {
        toast({
          title: "❌ Falha no teste",
          description: data.error || "Erro desconhecido.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Test webhook error:', error);
      toast({
        title: "❌ Erro no teste",
        description: "Não foi possível executar o teste do webhook.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-backdrop">
      <Navigation variant="dashboard" isAuthenticated={true} />
      
      <div className="container mx-auto px-4 py-8">
        <BackButton className="mb-6" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Teste de Webhook WhatsApp</h1>
            <p className="text-muted-foreground mb-8">
              Teste a integração com o N8N para envio de mensagens no WhatsApp
            </p>

            <div className="grid gap-6">
              {/* Teste do Webhook */}
              <Card className="glass-card">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <MessageSquare className="w-6 h-6 text-primary" />
                    <h2 className="text-xl font-semibold">Teste de Integração</h2>
                  </div>
                  
                  <p className="text-muted-foreground mb-6">
                    Clique no botão abaixo para enviar uma mensagem de teste para o N8N. 
                    Se configurado corretamente, você receberá uma mensagem no WhatsApp.
                  </p>

                  <Button 
                    onClick={handleTestWebhook} 
                    disabled={loading}
                    className="btn-glow btn-3d"
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Enviando teste...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Enviar Teste
                      </>
                    )}
                  </Button>
                </div>
              </Card>

              {/* Resultado do último teste */}
              {lastResult && (
                <Card className="glass-card">
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      {lastResult.success ? (
                        <CheckCircle className="w-6 h-6 text-success" />
                      ) : (
                        <XCircle className="w-6 h-6 text-destructive" />
                      )}
                      <h2 className="text-xl font-semibold">Resultado do Teste</h2>
                      <Badge variant={lastResult.success ? "default" : "destructive"}>
                        {lastResult.success ? "Sucesso" : "Erro"}
                      </Badge>
                    </div>

                    {lastResult.success ? (
                      <div className="space-y-4">
                        <p className="text-success">
                          ✅ Webhook enviado com sucesso para o N8N!
                        </p>
                        
                        {lastResult.n8nResponse && (
                          <div className="bg-muted/50 rounded-lg p-4">
                            <h3 className="font-medium mb-2">Resposta do N8N:</h3>
                            <div className="text-sm space-y-1">
                              <p><strong>Status:</strong> {lastResult.n8nResponse.status}</p>
                              <p><strong>Status Text:</strong> {lastResult.n8nResponse.statusText}</p>
                              {lastResult.n8nResponse.body && (
                                <p><strong>Body:</strong> {lastResult.n8nResponse.body}</p>
                              )}
                            </div>
                          </div>
                        )}

                        {lastResult.payload && (
                          <div className="bg-muted/50 rounded-lg p-4">
                            <h3 className="font-medium mb-2">Dados enviados:</h3>
                            <pre className="text-xs bg-background/50 p-3 rounded overflow-x-auto">
                              {JSON.stringify(lastResult.payload, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-destructive">
                          ❌ Falha no envio do webhook
                        </p>
                        
                        {lastResult.error && (
                          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                            <h3 className="font-medium mb-2 text-destructive">Erro:</h3>
                            <p className="text-sm">{lastResult.error}</p>
                            {lastResult.details && (
                              <p className="text-sm mt-2 text-muted-foreground">{lastResult.details}</p>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              )}

              {/* Informações sobre o webhook */}
              <Card className="glass-card">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Como funciona</h2>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <p>
                      <strong>1. Teste Manual:</strong> O botão acima envia uma mensagem de teste diretamente para o N8N
                    </p>
                    <p>
                      <strong>2. Automático:</strong> Todo agendamento criado automaticamente dispara o webhook
                    </p>
                    <p>
                      <strong>3. N8N:</strong> O N8N processa a mensagem e envia pelo WhatsApp
                    </p>
                    <p>
                      <strong>4. WhatsApp:</strong> Cliente e profissional recebem confirmação do agendamento
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}