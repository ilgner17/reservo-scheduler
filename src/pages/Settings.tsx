import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Navigation } from "@/components/Navigation";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Save, User, Briefcase, Phone, CreditCard } from "lucide-react";

export default function Settings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    profession: "",
    bio: "",
    phone: "",
    pix_key: "",
    slug: ""
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        setProfile({
          name: data.name || "",
          profession: data.profession || "",
          bio: data.bio || "",
          phone: data.phone || "",
          pix_key: data.pix_key || "",
          slug: data.slug || ""
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Erro ao carregar perfil",
        description: "Não foi possível carregar seus dados.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: profile.name,
          profession: profile.profession,
          bio: profile.bio,
          phone: profile.phone,
          pix_key: profile.pix_key,
          slug: profile.slug
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Perfil atualizado!",
        description: "Suas alterações foram salvas com sucesso.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as alterações.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-backdrop">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold mb-8">Configurações da Conta</h1>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Informações Pessoais */}
            <Card className="glass-card">
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <User className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold">Informações Pessoais</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder="Seu nome completo"
                    />
                  </div>

                  <div>
                    <Label htmlFor="profession">Profissão</Label>
                    <Input
                      id="profession"
                      value={profile.profession}
                      onChange={(e) => handleChange('profession', e.target.value)}
                      placeholder="Ex: Psicólogo, Nutricionista"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      placeholder="(11) 99999-9999"
                    />
                  </div>

                  <div>
                    <Label htmlFor="bio">Biografia</Label>
                    <Textarea
                      id="bio"
                      value={profile.bio}
                      onChange={(e) => handleChange('bio', e.target.value)}
                      placeholder="Conte um pouco sobre você e seu trabalho..."
                      rows={4}
                    />
                  </div>

                  <Button type="submit" disabled={loading} className="w-full btn-glow">
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Salvar Alterações
                  </Button>
                </form>
              </div>
            </Card>

            {/* Link Público e Pagamentos */}
            <div className="space-y-6">
              <Card className="glass-card">
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Briefcase className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-semibold">Link Público</h2>
                  </div>

                  <div>
                    <Label htmlFor="slug">Seu link personalizado</Label>
                    <div className="flex items-center space-x-2">
                      <span className="text-muted-foreground text-sm">reservo.com/</span>
                      <Input
                        id="slug"
                        value={profile.slug}
                        onChange={(e) => handleChange('slug', e.target.value)}
                        placeholder="seulink"
                        className="flex-1"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Este será o link que seus clientes usarão para agendar consultas.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="glass-card">
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <CreditCard className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-semibold">Pagamentos PIX</h2>
                  </div>

                  <div>
                    <Label htmlFor="pix_key">Chave PIX</Label>
                    <Input
                      id="pix_key"
                      value={profile.pix_key}
                      onChange={(e) => handleChange('pix_key', e.target.value)}
                      placeholder="Sua chave PIX (email, telefone, CPF ou chave aleatória)"
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      Será usada para receber pagamentos via PIX.
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