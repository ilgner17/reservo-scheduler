import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Navigation } from "@/components/Navigation";
import { BackButton } from "@/components/BackButton";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Save, User, Briefcase, Phone, CreditCard, Camera, Upload } from "lucide-react";

export default function Settings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    profession: "",
    bio: "",
    phone: "",
    pix_key: "",
    slug: "",
    avatar_url: ""
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
          slug: data.slug || "",
          avatar_url: data.avatar_url || ""
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

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erro",
        description: "Por favor, selecione uma imagem válida.",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      toast({
        title: "Erro",
        description: "A imagem deve ter menos que 2MB.",
        variant: "destructive"
      });
      return;
    }

    setAvatarUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}/avatar.${fileExt}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: data.publicUrl })
        .eq('user_id', user?.id);

      if (updateError) throw updateError;

      setProfile(prev => ({ ...prev, avatar_url: data.publicUrl }));

      toast({
        title: "Sucesso",
        description: "Foto de perfil atualizada com sucesso!"
      });

    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Erro",
        description: "Erro ao fazer upload da imagem.",
        variant: "destructive"
      });
    } finally {
      setAvatarUploading(false);
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
          slug: profile.slug,
          avatar_url: profile.avatar_url
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
      <Navigation variant="dashboard" />
      
      <div className="container mx-auto px-4 pt-20 pb-8">
        <BackButton className="mb-4" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Configurações</h1>
            <p className="text-muted-foreground">
              Gerencie suas informações pessoais e preferências da conta
            </p>
          </div>

          {/* Avatar Section */}
          <Card className="glass-card mb-8">
            <div className="text-center p-6">
              <h2 className="text-xl font-semibold mb-6">Foto de Perfil</h2>
              
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-border">
                    {profile.avatar_url ? (
                      <img 
                        src={profile.avatar_url} 
                        alt="Avatar" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Camera className="w-8 h-8 text-muted-foreground" />
                    )}
                  </div>
                  
                  <Button
                    size="sm"
                    className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={avatarUploading}
                  >
                    <Upload className="w-4 h-4" />
                  </Button>
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
                
                <p className="text-sm text-muted-foreground max-w-sm">
                  Clique no ícone para alterar sua foto de perfil. 
                  Formatos aceitos: JPG, PNG. Tamanho máximo: 2MB.
                </p>
              </div>
            </div>
          </Card>

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