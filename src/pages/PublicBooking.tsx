import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon, Clock, User, Mail, Phone, FileText, CreditCard, QrCode, Star, MapPin, Award, Shield, DollarSign } from "lucide-react";
import { format, addMinutes } from "date-fns";
import { ptBR } from "date-fns/locale";
import reservoLogo from "@/assets/reservo-logo.png";

export default function PublicBooking() {
  const { slug } = useParams();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: booking, 2: payment
  const [professional, setProfessional] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("pix");
  const [formData, setFormData] = useState({
    service_type: "",
    service_price: "",
    client_name: "",
    client_email: "",
    client_phone: "",
    notes: ""
  });

  const timeSlots = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
    "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
    "17:00", "17:30", "18:00", "18:30", "19:00", "19:30"
  ];

  const priceOptions = [
    80, 100, 120, 150, 180, 200, 220, 250, 280, 300, 320, 350, 380, 400, 420, 450, 
    480, 500, 520, 550, 580, 600, 620, 650, 680, 700, 720, 750, 780, 800, 820, 850, 
    880, 900, 920, 950, 980, 1000
  ];

  useEffect(() => {
    if (slug) {
      fetchProfessionalData();
    }
  }, [slug]);

  const fetchProfessionalData = async () => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('slug', slug)
        .single();

      if (profileError) throw profileError;
      
      setProfessional(profileData);
    } catch (error) {
      console.error('Error fetching professional data:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar as informações do profissional.",
        variant: "destructive",
      });
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime || !formData.service_type || !formData.service_price) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setStep(2); // Move to payment step
  };

  const handlePaymentSubmit = async () => {
    setLoading(true);

    try {
      // Create start datetime
      const [hours, minutes] = selectedTime.split(':').map(Number);
      const startAt = new Date(selectedDate!);
      startAt.setHours(hours, minutes, 0, 0);
      
      // Calculate end datetime (1 hour default)
      const endAt = addMinutes(startAt, 60);

      // Create booking
      const { data: bookingData, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          professional_id: professional.user_id,
          client_name: formData.client_name,
          client_email: formData.client_email,
          client_phone: formData.client_phone,
          start_at: startAt.toISOString(),
          end_at: endAt.toISOString(),
          price_cents: parseInt(formData.service_price) * 100,
          notes: formData.notes,
          booking_type: formData.service_type,
          status: 'pending'
        })
        .select()
        .single();

      if (bookingError) throw bookingError;

      // Create payment record
      const { error: paymentError } = await supabase
        .from('payments')
        .insert({
          booking_id: bookingData.id,
          method: paymentMethod,
          amount_cents: parseInt(formData.service_price) * 100,
          status: 'pending'
        });

      if (paymentError) throw paymentError;

      toast({
        title: "Agendamento criado!",
        description: "Seu agendamento foi criado com sucesso. Aguarde a confirmação do pagamento.",
      });

      // Reset form
      setStep(1);
      setFormData({
        service_type: "",
        service_price: "",
        client_name: "",
        client_email: "",
        client_phone: "",
        notes: ""
      });
      setSelectedDate(undefined);
      setSelectedTime("");
    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: "Erro ao criar agendamento",
        description: "Não foi possível criar o agendamento.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!professional) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-backdrop">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-backdrop">
      {/* Header */}
      <header className="border-b border-card-border bg-background/95 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src={reservoLogo} 
                alt="Reservo Logo" 
                className="h-12 w-12 object-cover rounded-lg"
              />
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Reserva
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-success" />
              <span className="text-sm text-success font-medium">Pagamento Seguro</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Professional Profile */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <Card className="glass-card sticky top-24">
              <div className="p-6">
                {/* Profile Header */}
                <div className="text-center mb-6">
                  <motion.div
                    className="relative w-24 h-24 mx-auto mb-4"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    {professional.avatar_url ? (
                      <img 
                        src={professional.avatar_url} 
                        alt="Avatar" 
                        className="w-full h-full rounded-full object-cover border-4 border-primary/20"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-gradient-primary flex items-center justify-center text-white text-2xl font-bold border-4 border-primary/20">
                        {professional.name?.split(' ').map((n: string) => n[0]).join('') || 'P'}
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full border-2 border-background flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </motion.div>
                  
                  <h1 className="text-2xl font-bold mb-1">{professional.name}</h1>
                  <p className="text-primary font-medium mb-3">{professional.profession}</p>
                  
                  {/* Rating */}
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < 5 ? "text-warning fill-current" : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-semibold">5.0</span>
                    <span className="text-muted-foreground">(50+ avaliações)</span>
                  </div>
                </div>

                {/* Description */}
                {professional.bio && (
                  <div className="mb-6">
                    <h3 className="font-semibold mb-2">Sobre</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {professional.bio}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Booking Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="glass-card">
              <div className="p-8">
                <div className="mb-6">
                  <h2 className="text-3xl font-bold mb-2">
                    Agende sua <span className="bg-gradient-primary bg-clip-text text-transparent">Consulta</span>
                  </h2>
                  <p className="text-muted-foreground">
                    Escolha o melhor horário para seu atendimento.
                  </p>
                </div>

                {step === 1 ? (
                  <form onSubmit={handleBookingSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="service_type">Tipo de Agendamento *</Label>
                      <Input
                        id="service_type"
                        value={formData.service_type}
                        onChange={(e) => setFormData(prev => ({ ...prev, service_type: e.target.value }))}
                        placeholder="Ex: Consulta, Sessão, Avaliação..."
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="service_price">Preço (R$) *</Label>
                      <Select value={formData.service_price} onValueChange={(value) => setFormData(prev => ({ ...prev, service_price: value }))}>
                        <SelectTrigger>
                          <div className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-2" />
                            <SelectValue placeholder="Selecione o preço" />
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          {priceOptions.map((price) => (
                            <SelectItem key={price} value={price.toString()}>
                              R$ {price.toFixed(2)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label className="text-base font-medium mb-4 block">Data *</Label>
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          locale={ptBR}
                          disabled={(date) => date < new Date() || date.getDay() === 0}
                          className="rounded-md border border-border"
                        />
                      </div>

                      <div>
                        <Label>Horário *</Label>
                        <Select value={selectedTime} onValueChange={setSelectedTime}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o horário" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeSlots.map((time) => (
                              <SelectItem key={time} value={time}>
                                <div className="flex items-center">
                                  <Clock className="w-4 h-4 mr-2" />
                                  {time}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="client_name">Nome Completo *</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="client_name"
                            value={formData.client_name}
                            onChange={(e) => setFormData(prev => ({ ...prev, client_name: e.target.value }))}
                            placeholder="Seu nome completo"
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="client_email">Email *</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="client_email"
                            type="email"
                            value={formData.client_email}
                            onChange={(e) => setFormData(prev => ({ ...prev, client_email: e.target.value }))}
                            placeholder="seu@email.com"
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="client_phone">Telefone</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="client_phone"
                          value={formData.client_phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, client_phone: e.target.value }))}
                          placeholder="(11) 99999-9999"
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="notes">Observações</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Algo que o profissional deve saber..."
                        rows={3}
                      />
                    </div>

                    <Button type="submit" className="w-full btn-glow btn-3d" size="lg">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      Continuar para Pagamento
                    </Button>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-muted/50 p-6 rounded-lg">
                      <h3 className="font-semibold mb-4">Resumo do Agendamento</h3>
                      <div className="space-y-2 text-sm">
                        <p><strong>Tipo:</strong> {formData.service_type}</p>
                        <p><strong>Data:</strong> {selectedDate && format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</p>
                        <p><strong>Horário:</strong> {selectedTime}</p>
                        <p><strong>Duração:</strong> 60 minutos</p>
                        <p><strong>Valor:</strong> R$ {parseInt(formData.service_price).toFixed(2)}</p>
                      </div>
                    </div>

                    <div>
                      <Label>Forma de Pagamento</Label>
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <Button
                          type="button"
                          variant={paymentMethod === "pix" ? "default" : "outline"}
                          onClick={() => setPaymentMethod("pix")}
                          className="justify-start"
                        >
                          <QrCode className="w-4 h-4 mr-2" />
                          PIX
                        </Button>
                        <Button
                          type="button"
                          variant={paymentMethod === "card" ? "default" : "outline"}
                          onClick={() => setPaymentMethod("card")}
                          className="justify-start"
                        >
                          <CreditCard className="w-4 h-4 mr-2" />
                          Cartão
                        </Button>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                        Voltar
                      </Button>
                      <Button 
                        onClick={handlePaymentSubmit} 
                        disabled={loading}
                        className="flex-1 btn-glow btn-3d"
                      >
                        {loading ? (
                          <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                        ) : (
                          <CalendarIcon className="w-4 h-4 mr-2" />
                        )}
                        Confirmar Agendamento
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}