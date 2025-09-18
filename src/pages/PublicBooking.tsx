import { motion } from "framer-motion";
import { BookingWidget } from "@/components/BookingWidget";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, MapPin, Award, Shield } from "lucide-react";
import logoImage from "@/assets/logo.png";

const professionalData = {
  name: "Dr. João Silva",
  profession: "Psicólogo Clínico",
  rating: 4.9,
  reviews: 127,
  location: "São Paulo, SP",
  experience: "8 anos",
  description: "Psicólogo especializado em terapia cognitivo-comportamental, ansiedade e depressão. Formado pela USP com mestrado em Psicologia Clínica.",
  specialties: ["Ansiedade", "Depressão", "Terapia de Casal", "Burnout"],
  certifications: ["CRP-06", "Especialista em TCC", "Mestre em Psicologia"],
  avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face"
};

export default function PublicBooking() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-card-border bg-background/95 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src={logoImage} 
                alt="Reservo Logo" 
                className="h-8 w-8 object-contain"
              />
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Reservo
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
                    <img
                      src={professionalData.avatar}
                      alt={professionalData.name}
                      className="w-full h-full rounded-full object-cover border-4 border-primary/20"
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full border-2 border-background flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </motion.div>
                  
                  <h1 className="text-2xl font-bold mb-1">{professionalData.name}</h1>
                  <p className="text-primary font-medium mb-3">{professionalData.profession}</p>
                  
                  {/* Rating */}
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(professionalData.rating)
                              ? "text-warning fill-current"
                              : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-semibold">{professionalData.rating}</span>
                    <span className="text-muted-foreground">({professionalData.reviews} avaliações)</span>
                  </div>

                  {/* Quick Info */}
                  <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{professionalData.location}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{professionalData.experience}</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Sobre</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {professionalData.description}
                  </p>
                </div>

                {/* Specialties */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Especialidades</h3>
                  <div className="flex flex-wrap gap-2">
                    {professionalData.specialties.map((specialty) => (
                      <Badge key={specialty} variant="secondary" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Certifications */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center">
                    <Award className="w-4 h-4 mr-2 text-primary" />
                    Certificações
                  </h3>
                  <div className="space-y-2">
                    {professionalData.certifications.map((cert) => (
                      <div key={cert} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="text-sm text-muted-foreground">{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Booking Widget */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="mb-6">
              <h2 className="text-3xl font-bold mb-2">
                Agende sua <span className="bg-gradient-primary bg-clip-text text-transparent">Consulta</span>
              </h2>
              <p className="text-muted-foreground">
                Escolha o melhor horário para seu atendimento. O agendamento é confirmado após o pagamento.
              </p>
            </div>
            
            <BookingWidget />
          </motion.div>
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-success" />
              <span>Pagamentos Seguros</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-primary" />
              <span>Confirmação Imediata</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="w-4 h-4 text-warning" />
              <span>Profissional Verificado</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}