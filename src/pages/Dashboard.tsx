import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Plus,
  Eye,
  Settings
} from "lucide-react";

const stats = [
  {
    title: "Agendamentos Hoje",
    value: "12",
    change: "+3 desde ontem",
    icon: Calendar,
    color: "text-primary"
  },
  {
    title: "Próximos 7 dias",
    value: "47",
    change: "+15% vs semana passada",
    icon: Clock,
    color: "text-success"
  },
  {
    title: "Receita do Mês",
    value: "R$ 8.420",
    change: "+22% vs mês passado",
    icon: DollarSign,
    color: "text-warning"
  },
  {
    title: "Novos Clientes",
    value: "28",
    change: "+8 este mês",
    icon: Users,
    color: "text-destructive"
  }
];

const recentBookings = [
  {
    id: 1,
    client: "Maria Silva",
    service: "Consulta Nutricional",
    time: "14:00",
    date: "Hoje",
    status: "confirmado",
    amount: "R$ 150"
  },
  {
    id: 2,
    client: "João Santos",
    service: "Sessão de Terapia",
    time: "16:30",
    date: "Hoje",
    status: "pendente",
    amount: "R$ 200"
  },
  {
    id: 3,
    client: "Ana Costa",
    service: "Avaliação Física",
    time: "09:00",
    date: "Amanhã",
    status: "confirmado",
    amount: "R$ 120"
  }
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation variant="dashboard" isAuthenticated={true} />
      
      <main className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  Bem-vindo de volta, <span className="bg-gradient-primary bg-clip-text text-transparent">Dr. Silva</span>
                </h1>
                <p className="text-muted-foreground">Aqui está um resumo da sua agenda hoje</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  Ver Perfil Público
                </Button>
                <Button size="sm" className="btn-glow">
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Agendamento
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
                >
                  <Card className="glass-card hover:shadow-hover transition-all duration-300 cursor-pointer group">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-2 rounded-lg bg-primary/10 ${stat.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <TrendingUp className="w-4 h-4 text-success opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-xs text-success">{stat.change}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Recent Bookings */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <Card className="glass-card">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Próximos Agendamentos</h2>
                    <Button variant="ghost" size="sm">
                      Ver Todos
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {recentBookings.map((booking, index) => (
                      <motion.div
                        key={booking.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                        className="flex items-center justify-between p-4 rounded-lg border border-card-border hover:bg-muted/50 transition-colors group cursor-pointer"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {booking.client.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-medium group-hover:text-primary transition-colors">
                              {booking.client}
                            </p>
                            <p className="text-sm text-muted-foreground">{booking.service}</p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="flex items-center space-x-3">
                            <div>
                              <p className="text-sm font-medium">{booking.time}</p>
                              <p className="text-xs text-muted-foreground">{booking.date}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-semibold text-success">{booking.amount}</p>
                              <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                                booking.status === 'confirmado' 
                                  ? 'bg-success/10 text-success' 
                                  : 'bg-warning/10 text-warning'
                              }`}>
                                {booking.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-6"
            >
              <Card className="glass-card">
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Ações Rápidas</h3>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Calendar className="w-4 h-4 mr-2" />
                      Ver Calendário Completo
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Users className="w-4 h-4 mr-2" />
                      Gerenciar Clientes
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Settings className="w-4 h-4 mr-2" />
                      Configurar Horários
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <DollarSign className="w-4 h-4 mr-2" />
                      Relatório Financeiro
                    </Button>
                  </div>
                </div>
              </Card>

              <Card className="glass-card">
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Link de Agendamento</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Compartilhe este link para que clientes agendem diretamente:
                  </p>
                  <div className="p-3 bg-muted rounded-lg">
                    <code className="text-xs text-primary">reservo.app/dr-silva</code>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-3">
                    Copiar Link
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}