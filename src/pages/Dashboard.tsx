import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/BackButton";
import { Calendar, Clock, DollarSign, Users, Plus, Settings, ExternalLink } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    thisMonth: 0,
    pendingPayments: 0
  });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      setProfile(profileData);

      // Fetch bookings stats
      const { data: bookings } = await supabase
        .from('bookings') 
        .select('*, payments(*)')
        .eq('professional_id', user.id);

      if (bookings) {
        const confirmedBookings = bookings.filter((b: any) => b.status === 'confirmed');
        const totalRevenue = confirmedBookings.reduce((sum: number, booking: any) => sum + (booking.price_cents / 100), 0);
        
        const thisMonth = new Date();
        thisMonth.setMonth(thisMonth.getMonth());
        const monthlyBookings = bookings.filter((b: any) => 
          new Date(b.created_at).getMonth() === thisMonth.getMonth() &&
          new Date(b.created_at).getFullYear() === thisMonth.getFullYear()
        );

        const pendingPayments = bookings.filter((b: any) => b.status === 'pending').length;

        setStats({
          totalBookings: bookings.length,
          totalRevenue: totalRevenue,
          thisMonth: monthlyBookings.length,
          pendingPayments
        });

        // Get recent bookings
        const recent = bookings
          .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 5);
        setRecentBookings(recent);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os dados do dashboard.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-backdrop">
        <Navigation variant="dashboard" isAuthenticated={true} />
        <div className="flex items-center justify-center h-96">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  const statsData = [
    {
      title: "Total de Agendamentos",
      value: stats.totalBookings.toString(),
      change: `${stats.thisMonth} este mês`,
      icon: Calendar,
      color: "text-primary"
    },
    {
      title: "Receita Total",
      value: `R$ ${stats.totalRevenue.toFixed(2)}`,
      change: `${stats.pendingPayments} pendentes`,
      icon: DollarSign,
      color: "text-success"
    },
    {
      title: "Este Mês",
      value: stats.thisMonth.toString(),
      change: "agendamentos",
      icon: Clock,
      color: "text-warning"
    },
    {
      title: "Pagamentos Pendentes",
      value: stats.pendingPayments.toString(),
      change: "aguardando confirmação",
      icon: Users,
      color: "text-destructive"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-backdrop">
      <Navigation variant="dashboard" isAuthenticated={true} />
      
      <div className="container mx-auto px-4 pt-16 pb-8">
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
                Bem-vindo, <span className="bg-gradient-primary bg-clip-text text-transparent">
                  {profile?.name || user?.email}
                </span>
              </h1>
              <p className="text-muted-foreground">Aqui está um resumo da sua agenda</p>
            </div>
            <div className="flex gap-3">
              {profile?.slug && (
                <Link to={`/booking/${profile.slug}`} target="_blank">
                  <Button variant="outline" size="sm">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Ver Perfil Público
                  </Button>
                </Link>
              )}
              <Link to="/new-booking">
                <Button size="sm" className="btn-glow">
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Agendamento
                </Button>
              </Link>
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
          {statsData.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
              >
                <Card className="glass-card hover:shadow-hover transition-all duration-300">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-2 rounded-lg bg-primary/10 ${stat.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.change}</p>
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
                  <h2 className="text-xl font-semibold">Últimos Agendamentos</h2>
                </div>
                
                <div className="space-y-4">
                  {recentBookings.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Nenhum agendamento ainda</p>
                      <Link to="/new-booking">
                        <Button className="mt-4">Criar primeiro agendamento</Button>
                      </Link>
                    </div>
                  ) : (
                    recentBookings.map((booking: any, index: number) => (
                      <motion.div
                        key={booking.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                        className="flex items-center justify-between p-4 rounded-lg border border-card-border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {booking.client_name?.split(' ').map((n: string) => n[0]).join('') || 'C'}
                          </div>
                          <div>
                            <p className="font-medium">{booking.client_name}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(booking.start_at).toLocaleDateString('pt-BR')} às {new Date(booking.start_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-sm font-semibold text-success">
                            R$ {(booking.price_cents / 100).toFixed(2)}
                          </p>
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                            booking.status === 'confirmed' 
                              ? 'bg-success/10 text-success' 
                              : booking.status === 'pending'
                              ? 'bg-warning/10 text-warning'
                              : 'bg-destructive/10 text-destructive'
                          }`}>
                            {booking.status === 'confirmed' ? 'Confirmado' : 
                             booking.status === 'pending' ? 'Pendente' : 'Cancelado'}
                          </span>
                        </div>
                      </motion.div>
                    ))
                  )}
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
                  <Link to="/new-booking">
                    <Button variant="outline" className="w-full justify-start">
                      <Plus className="w-4 h-4 mr-2" />
                      Novo Agendamento
                    </Button>
                  </Link>
                  <Link to="/settings">
                    <Button variant="outline" className="w-full justify-start">
                      <Settings className="w-4 h-4 mr-2" />
                      Configurações
                    </Button>
                  </Link>
                  <Link to="/pricing">
                    <Button variant="outline" className="w-full justify-start">
                      <DollarSign className="w-4 h-4 mr-2" />
                      Upgrade do Plano
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>

            {profile?.slug && (
              <Card className="glass-card">
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Link de Agendamento</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Compartilhe este link para que clientes agendem:
                  </p>
                  <div className="p-3 bg-muted rounded-lg mb-3">
                    <code className="text-xs text-primary break-all">
                      {window.location.origin}/booking/{profile.slug}
                    </code>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/booking/${profile.slug}`);
                      toast({ title: "Link copiado!" });
                    }}
                  >
                    Copiar Link
                  </Button>
                </div>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}