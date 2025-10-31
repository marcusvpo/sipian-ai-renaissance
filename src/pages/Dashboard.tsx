import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { 
  Sparkles, 
  MessageSquare, 
  FileSearch, 
  Wand2, 
  BarChart3,
  LogOut,
  User as UserIcon,
  ChevronRight
} from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const Dashboard = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }
      
      setUser(session.user);
      setIsDemo(session.user?.user_metadata?.is_demo || false);
      setIsLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        setIsDemo(session.user?.user_metadata?.is_demo || false);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logout realizado",
      description: "Até logo!",
    });
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
              SIPLAN IA
            </span>
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <UserIcon className="w-4 h-4" />
              <span className="hidden sm:inline">{user?.email}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Demo Banner */}
        {isDemo && (
          <div className="mb-6 p-4 bg-warning/10 border border-warning/30 rounded-lg">
            <div className="flex items-center gap-3">
              <Badge className="bg-warning text-warning-foreground">MODO DEMO</Badge>
              <p className="text-sm">
                Você está explorando a plataforma em modo demonstração. Todas as funcionalidades estão disponíveis para teste.
              </p>
            </div>
          </div>
        )}

        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Bem-vindo de volta! 👋
          </h1>
          <p className="text-muted-foreground">
            O que você gostaria de fazer hoje?
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Análises Disponíveis
              </CardTitle>
              <FileSearch className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5/5</div>
              <p className="text-xs text-muted-foreground mt-1">
                Plano Free
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Chats Disponíveis
              </CardTitle>
              <MessageSquare className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">10/10</div>
              <p className="text-xs text-muted-foreground mt-1">
                Plano Free
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                GEMS Ativos
              </CardTitle>
              <Wand2 className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground mt-1">
                Crie seu primeiro
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Documentos Analisados
              </CardTitle>
              <BarChart3 className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground mt-1">
                Este mês
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <Link to="/chat">
            <Card className="hover:shadow-lg transition-all cursor-pointer group">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="flex items-center justify-between">
                  Chatbot Especialista
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </CardTitle>
                <CardDescription>
                  Converse com nossa IA treinada em legislação cartorial brasileira
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/analyzer">
            <Card className="hover:shadow-lg transition-all cursor-pointer group">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FileSearch className="w-6 h-6 text-success" />
                </div>
                <CardTitle className="flex items-center justify-between">
                  Analisar Documentos
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </CardTitle>
                <CardDescription>
                  Envie PDFs ou imagens para análise estruturada com IA
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/gems">
            <Card className="hover:shadow-lg transition-all cursor-pointer group">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Wand2 className="w-6 h-6 text-warning" />
                </div>
                <CardTitle className="flex items-center justify-between">
                  Meus GEMS
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </CardTitle>
                <CardDescription>
                  Crie e gerencie assistentes de IA personalizados
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* Upgrade CTA */}
        <Card className="mt-8 bg-gradient-to-r from-primary/10 via-primary/5 to-success/10 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Desbloqueie todo o potencial da SIPLAN IA
            </CardTitle>
            <CardDescription>
              Upgrade para o plano Pro e tenha acesso a 100 análises por mês, IA GPT-5 Premium, sugestões de exigências e muito mais.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/#pricing">
              <Button className="bg-gradient-to-r from-primary to-primary-hover">
                Ver Planos
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
