import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Wand2, Plus, Lock } from "lucide-react";
import type { User } from "@supabase/supabase-js";

const Gems = () => {
  const [user, setUser] = useState<User | null>(null);
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
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const preBuiltGems = [
    {
      name: "Qualificador Registral",
      description: "Analisa títulos e aponta vícios formais e materiais de acordo com a Lei de Registros Públicos",
      category: "Análise",
      isPro: false,
    },
    {
      name: "Mentor Junior",
      description: "Assistente educacional que explica conceitos cartoriais para colaboradores em treinamento",
      category: "Educação",
      isPro: false,
    },
    {
      name: "Gerador de Minutas",
      description: "Cria minutas padronizadas para diversos tipos de atos cartoriais",
      category: "Produtividade",
      isPro: true,
    },
    {
      name: "Pesquisador de Jurisprudência",
      description: "Busca e resume decisões judiciais relacionadas a casos específicos",
      category: "Pesquisa",
      isPro: true,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div>
              <h1 className="font-semibold">Meus GEMS</h1>
              <p className="text-xs text-muted-foreground">Assistentes de IA personalizados</p>
            </div>
          </div>
          <Button className="bg-gradient-to-r from-primary to-primary-hover" disabled>
            <Plus className="w-4 h-4 mr-2" />
            Criar GEM
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Info Banner */}
        <Card className="mb-8 bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Wand2 className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">O que são GEMS?</h3>
                <p className="text-sm text-muted-foreground">
                  GEMS são assistentes de IA especializados que você pode usar ou criar para tarefas específicas do seu cartório. 
                  Use nossos GEMS pré-construídos ou crie os seus próprios com o Prompt Builder visual.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pre-built GEMS */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">GEMS Pré-Construídos</h2>
            <Badge variant="secondary">4 disponíveis</Badge>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {preBuiltGems.map((gem, index) => (
              <Card key={index} className="hover:shadow-lg transition-all relative">
                {gem.isPro && (
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      Pro
                    </Badge>
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center flex-shrink-0">
                      <Wand2 className="w-5 h-5 text-warning" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{gem.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {gem.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{gem.category}</Badge>
                    <Button 
                      size="sm" 
                      variant={gem.isPro ? "outline" : "default"}
                      disabled={gem.isPro}
                      className={!gem.isPro ? "bg-gradient-to-r from-primary to-primary-hover" : ""}
                    >
                      {gem.isPro ? "Requer Pro" : "Usar Agora"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Custom GEMS Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Meus GEMS Customizados</h2>
            <Badge variant="secondary">0 criados</Badge>
          </div>

          <Card className="text-center py-16">
            <CardContent>
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                <Wand2 className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Nenhum GEM customizado ainda</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Crie seu primeiro assistente personalizado com o Prompt Builder visual. 
                Disponível no plano Pro.
              </p>
              <div className="flex items-center justify-center gap-3">
                <Link to="/#pricing">
                  <Button className="bg-gradient-to-r from-primary to-primary-hover">
                    Upgrade para Pro
                  </Button>
                </Link>
                <Button variant="outline" disabled>
                  <Plus className="w-4 h-4 mr-2" />
                  Criar GEM
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Gems;
