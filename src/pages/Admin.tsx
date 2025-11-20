import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PropertyForm from "@/components/PropertyForm";
import PropertyEditForm from "@/components/PropertyEditForm";
import PropertyList from "@/components/PropertyList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, List, BarChart3, Home, DollarSign, Eye } from "lucide-react";

const Admin = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    sold: 0,
    rented: 0,
    totalValue: 0,
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        setLoading(false);
        fetchStats(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        fetchStats(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchStats = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("properties")
        .select("status, price")
        .eq("user_id", userId);

      if (error) throw error;

      const total = data?.length || 0;
      const available = data?.filter(p => p.status === "available").length || 0;
      const sold = data?.filter(p => p.status === "sold").length || 0;
      const rented = data?.filter(p => p.status === "rented").length || 0;
      const totalValue = data?.reduce((sum, p) => sum + (p.price || 0), 0) || 0;

      setStats({ total, available, sold, rented, totalValue });
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
    }
  };

  const handlePropertyAdded = () => {
    setRefreshKey(prev => prev + 1);
    if (user) fetchStats(user.id);
    setActiveTab("list");
  };

  const handlePropertyUpdated = () => {
    setRefreshKey(prev => prev + 1);
    if (user) fetchStats(user.id);
    setEditingPropertyId(null);
    setActiveTab("list");
  };

  const handleEdit = (propertyId: string) => {
    setEditingPropertyId(propertyId);
    setActiveTab("edit");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Painel Administrativo</h1>
          <p className="text-muted-foreground mt-2">Gerencie seus imóveis e acompanhe suas métricas</p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-3xl grid-cols-4">
            <TabsTrigger value="dashboard">
              <BarChart3 className="mr-2 h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="list">
              <List className="mr-2 h-4 w-4" />
              Meus Imóveis
            </TabsTrigger>
            <TabsTrigger value="add">
              <Plus className="mr-2 h-4 w-4" />
              Adicionar
            </TabsTrigger>
            {editingPropertyId && (
              <TabsTrigger value="edit">
                <Plus className="mr-2 h-4 w-4" />
                Editar
              </TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="dashboard" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Imóveis</CardTitle>
                  <Home className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Disponíveis</CardTitle>
                  <Eye className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.available}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Vendidos</CardTitle>
                  <DollarSign className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{stats.sold}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Alugados</CardTitle>
                  <DollarSign className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{stats.rented}</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Valor Total do Portfólio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-accent">
                  R$ {stats.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Soma de todos os imóveis cadastrados
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="list" className="mt-6">
            <PropertyList key={refreshKey} userId={user?.id} onEdit={handleEdit} />
          </TabsContent>
          
          <TabsContent value="add" className="mt-6">
            <PropertyForm onSuccess={handlePropertyAdded} />
          </TabsContent>

          {editingPropertyId && (
            <TabsContent value="edit" className="mt-6">
              <PropertyEditForm
                propertyId={editingPropertyId}
                onSuccess={handlePropertyUpdated}
                onCancel={() => {
                  setEditingPropertyId(null);
                  setActiveTab("list");
                }}
              />
            </TabsContent>
          )}
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default Admin;
