import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, FileSearch, Sparkles, Check, Zap, Shield, BarChart3, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Landing = () => {
  const [isLoadingDemo, setIsLoadingDemo] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDemoLogin = async () => {
    setIsLoadingDemo(true);
    
    try {
      // Criar conta demo via edge function
      const { data, error } = await supabase.functions.invoke('create-demo-account');
      
      if (error) throw error;
      
      if (!data?.email || !data?.password) {
        throw new Error('Credenciais demo não recebidas');
      }

      // Fazer login com a conta demo criada
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (signInError) throw signInError;

      toast({
        title: "Bem-vindo ao modo demo! 🎉",
        description: "Explore todas as funcionalidades da plataforma",
      });

      navigate('/dashboard');
    } catch (error: any) {
      console.error('Demo login error:', error);
      toast({
        title: "Erro ao criar demo",
        description: error.message || "Tente novamente",
        variant: "destructive",
      });
    } finally {
      setIsLoadingDemo(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
              SIPLAN IA
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Recursos
            </a>
            <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Planos
            </a>
            <Link to="/auth">
              <Button variant="ghost" size="sm">
                Entrar
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="sm" className="bg-siplan-carmesim hover:bg-siplan-urucum text-white">
                Começar Grátis
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <Badge variant="secondary" className="px-4 py-1.5">
            <Zap className="w-3 h-3 mr-1.5" />
            42 anos de expertise cartorial
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Inteligência Artificial
            <br />
            <span className="bg-gradient-to-r from-siplan-carmesim to-siplan-urucum bg-clip-text text-transparent">
              para Cartórios
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Transforme sua rotina cartorial com IA especializada. Análise de documentos, chatbot jurídico e assistentes personalizados em uma única plataforma.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/auth">
              <Button size="lg" className="bg-siplan-carmesim hover:bg-siplan-urucum text-white h-12 px-8 text-base">
                Começar Grátis
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              className="h-12 px-8 text-base"
              onClick={handleDemoLogin}
              disabled={isLoadingDemo}
            >
              {isLoadingDemo ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando demo...
                </>
              ) : (
                "Ver Demo"
              )}
            </Button>
          </div>
          <div className="flex items-center justify-center gap-8 pt-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-success" />
              <span>5 análises grátis</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-success" />
              <span>Sem cartão de crédito</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-success" />
              <span>Cancele quando quiser</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Recursos</Badge>
            <h2 className="text-4xl font-bold mb-4">Tudo que você precisa</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Uma plataforma completa para revolucionar sua rotina cartorial
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <MessageSquare className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Chatbot Especialista</CardTitle>
                <CardDescription>
                  "ChatGPT dos Cartórios" treinado 100% em legislação cartorial brasileira
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                    <span>Respostas instantâneas sobre qualquer aspecto cartorial</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                    <span>Pesquisa de Provimentos CNJ e jurisprudência</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                    <span>Citação de fontes legais em cada resposta</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center mb-4">
                  <FileSearch className="w-6 h-6 text-success" />
                </div>
                <CardTitle>Analisador de Documentos</CardTitle>
                <CardDescription>
                  Upload de PDFs/JPGs com OCR inteligente e análise estruturada
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                    <span>Análise de matrículas, títulos, minutas e certidões</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                    <span>Relatório estruturado com semáforo visual</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                    <span>Identificação automática de pendências</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-warning" />
                </div>
                <CardTitle>NEXUS Personalizados</CardTitle>
                <CardDescription>
                  Crie assistentes de IA customizados para sua rotina específica
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                    <span>Qualificador Registral, Mentor Junior e mais</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                    <span>Prompt Builder visual para customização</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                    <span>Reutilize em diferentes contextos</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-8">
            <Card className="hover:shadow-lg transition-all">
              <CardHeader>
                <Shield className="w-8 h-8 text-primary mb-2" />
                <CardTitle className="text-lg">Segurança Total</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Seus dados protegidos com criptografia de ponta e conformidade LGPD
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all">
              <CardHeader>
                <BarChart3 className="w-8 h-8 text-success mb-2" />
                <CardTitle className="text-lg">Analytics Inteligente</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Acompanhe métricas e otimize sua produtividade com insights em tempo real
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all">
              <CardHeader>
                <Zap className="w-8 h-8 text-warning mb-2" />
                <CardTitle className="text-lg">Atualizações Contínuas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Base de conhecimento atualizada com novas leis e provimentos automaticamente
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Planos</Badge>
            <h2 className="text-4xl font-bold mb-4">Escolha o plano ideal</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comece grátis e evolua conforme suas necessidades
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Free</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">R$ 0</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
                <CardDescription className="mt-2">Perfeito para conhecer a plataforma</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-success" />
                    <span>5 análises de documentos/mês</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-success" />
                    <span>10 conversas com chatbot/mês</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-success" />
                    <span>IA GPT-4o mini</span>
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <span className="w-5 h-5" />
                    <span>Sugestões de exigências</span>
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <span className="w-5 h-5" />
                    <span>NEXUS customizados</span>
                  </li>
                </ul>
                <Link to="/auth" className="block">
                  <Button variant="outline" className="w-full">
                    Experimente Grátis
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary shadow-xl relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-primary to-primary-hover text-primary-foreground px-4 py-1">
                  Mais Popular
                </Badge>
              </div>
              <CardHeader>
                <CardTitle>Pro</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">R$ 199</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
                <CardDescription className="mt-2">Para profissionais que querem mais poder</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-success" />
                    <span className="font-medium">100 análises de documentos/mês</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-success" />
                    <span className="font-medium">Conversas ilimitadas</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-success" />
                    <span className="font-medium">IA GPT-5 Premium</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-success" />
                    <span className="font-medium">Sugestões de exigências</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-success" />
                    <span className="font-medium">NEXUS customizados</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-success" />
                    <span className="font-medium">Mapas mentais</span>
                  </li>
                </ul>
                <Link to="/auth" className="block">
                  <Button className="w-full bg-siplan-carmesim hover:bg-siplan-urucum text-white">
                    Comece Agora
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle>Enterprise</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">R$ 799</span>
                  <span className="text-muted-foreground">+/mês</span>
                </div>
                <CardDescription className="mt-2">Para cartórios que precisam de tudo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-success" />
                    <span className="font-medium">Análises ilimitadas</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-success" />
                    <span className="font-medium">Conversas ilimitadas</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-success" />
                    <span className="font-medium">IA GPT-5 Premium</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-success" />
                    <span className="font-medium">Todos os recursos Pro</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-success" />
                    <span className="font-medium">Suporte prioritário</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-success" />
                    <span className="font-medium">Treinamento personalizado</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full">
                  Fale com Vendas
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 bg-gradient-to-r from-primary/10 via-primary/5 to-success/10 rounded-3xl my-20">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold">
            Pronto para revolucionar
            <br />
            seu cartório?
          </h2>
          <p className="text-xl text-muted-foreground">
            Junte-se a centenas de profissionais que já transformaram sua rotina com IA
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/auth">
              <Button size="lg" className="bg-siplan-carmesim hover:bg-siplan-urucum text-white h-12 px-8">
                Começar Gratuitamente
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-siplan-borgonha">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-siplan-carmesim flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">SIPLAN IA</span>
              </div>
              <p className="text-sm text-siplan-cinza-medio">
                42 anos de expertise cartorial transformados em inteligência artificial.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-white">Produto</h3>
              <ul className="space-y-2 text-sm text-siplan-cinza-medio">
                <li><a href="#features" className="hover:text-white transition-colors">Recursos</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Planos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentação</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-white">Empresa</h3>
              <ul className="space-y-2 text-sm text-siplan-cinza-medio">
                <li><a href="#" className="hover:text-white transition-colors">Sobre</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-white">Legal</h3>
              <ul className="space-y-2 text-sm text-siplan-cinza-medio">
                <li><a href="#" className="hover:text-white transition-colors">Privacidade</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Termos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">LGPD</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-siplan-bordo mt-8 pt-8 text-center text-sm text-siplan-cinza-medio">
            © 2025 SIPLAN IA. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
