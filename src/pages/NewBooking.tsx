import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { BackButton } from "@/components/BackButton";
import { Navigation } from "@/components/Navigation";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon, Clock, User, Mail, Phone, FileText, DollarSign } from "lucide-react";
import { format, addMinutes } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

export default function NewBooking() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime || !formData.service_type || !formData.service_price) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Create start datetime
      const [hours, minutes] = selectedTime.split(':').map(Number);
      const startAt = new Date(selectedDate);
      startAt.setHours(hours, minutes, 0, 0);
      
      // Calculate end datetime (1 hour default)
      const endAt = addMinutes(startAt, 60);

      // Check for conflicts
      const { data: conflicts } = await supabase
        .from('bookings')
        .select('id')
        .eq('professional_id', user.id)
        .gte('start_at', startAt.toISOString())
        .lt('start_at', endAt.toISOString())
        .neq('status', 'cancelled');

      if (conflicts && conflicts.length > 0) {
        toast({
          title: "Conflito de horário",
          description: "Já existe um agendamento neste horário.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Create booking
      const { data: bookingData, error } = await supabase
        .from('bookings')
        .insert({
          professional_id: user.id,
          client_name: formData.client_name,
          client_email: formData.client_email,
          client_phone: formData.client_phone,
          start_at: startAt.toISOString(),
          end_at: endAt.toISOString(),
          price_cents: parseInt(formData.service_price) * 100,
          notes: formData.notes,
          booking_type: formData.service_type,
          status: 'confirmed'  // Admin created bookings are auto-confirmed
        })
        .select()
        .single();

      if (error) throw error;

      // Send WhatsApp notification
      if (bookingData) {
        try {
          await supabase.functions.invoke('whatsapp-webhook', {
            body: {
              bookingId: bookingData.id,
              action: 'novo_agendamento'
            }
          });
        } catch (webhookError) {
          // Don't fail the booking if webhook fails, just log it
          console.error('WhatsApp webhook error:', webhookError);
        }
      }

      toast({
        title: "Agendamento criado!",
        description: "O agendamento foi criado com sucesso.",
      });

      navigate('/dashboard');
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
          <h1 className="text-3xl font-bold mb-8">Novo Agendamento</h1>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form */}
            <Card className="glass-card">
              <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="client_name">Nome do Cliente *</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="client_name"
                          value={formData.client_name}
                          onChange={(e) => setFormData(prev => ({ ...prev, client_name: e.target.value }))}
                          placeholder="Nome completo"
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
                          placeholder="email@exemplo.com"
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
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Observações adicionais..."
                        className="pl-10"
                        rows={3}
                      />
                    </div>
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

                  <Button type="submit" disabled={loading} className="w-full btn-glow btn-3d">
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                    ) : (
                      <CalendarIcon className="w-4 h-4 mr-2" />
                    )}
                    Criar Agendamento
                  </Button>
                </form>
              </div>
            </Card>

            {/* Calendar */}
            <Card className="glass-card">
              <div className="p-6">
                <Label className="text-base font-medium mb-4 block">Selecione a Data *</Label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  locale={ptBR}
                  disabled={(date) => date < new Date() || date.getDay() === 0} // Disable past dates and Sundays
                  className="rounded-md border border-border"
                />
                
                {selectedDate && (
                  <div className="mt-4 p-4 bg-primary/10 rounded-lg">
                    <p className="text-sm font-medium">
                      Data selecionada: {format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}