import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  MessageSquare, 
  FileSearch, 
  Sparkles, 
  Check, 
  Zap, 
  Shield, 
  BarChart3, 
  Loader2,
  Lock,
  FileText,
  Flag,
  MessageCircle,
  CheckCircle,
  XCircle,
  ArrowRight
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Landing = () => {
  const [isLoadingDemo, setIsLoadingDemo] = useState(false);
  const [betaFormData, setBetaFormData] = useState({
    cargo: "",
    dificuldade: "",
    sistema: ""
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDemoLogin = async () => {
    setIsLoadingDemo(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-demo-account');
      
      if (error) throw error;
      
      if (!data?.email || !data?.password) {
        throw new Error('Credenciais demo não recebidas');
      }

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

  const handleBetaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Inscrição realizada! 🚀",
      description: "Em breve entraremos em contato com você.",
    });
    setBetaFormData({ cargo: "", dificuldade: "", sistema: "" });
  };

  return (
    <div className="min-h-screen bg-background font-inter">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-siplan-carmesim to-siplan-urucum flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold font-merriweather text-siplan-bordo">
              SIPLAN IA
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#recursos" className="text-sm font-medium text-muted-foreground hover:text-siplan-carmesim transition-colors">
              Recursos
            </a>
            <a href="#planos" className="text-sm font-medium text-muted-foreground hover:text-siplan-carmesim transition-colors">
              Planos
            </a>
            <a href="#beta" className="text-sm font-medium text-muted-foreground hover:text-siplan-carmesim transition-colors">
              Beta
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

      {/* SEÇÃO 1: HERO (Acima da Dobra) */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <div className="space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold font-merriweather text-siplan-bordo leading-tight">
              A inteligência artificial que devolve tempo e tranquilidade ao seu Cartório.
            </h1>
            <p className="text-xl text-siplan-cinza leading-relaxed">
              O SIPLAN IA automatiza análises documentais e atendimentos com segurança e precisão — reduzindo até 75% do tempo operacional, sem abrir mão da confiabilidade que seu cartório exige.
            </p>
            <div className="space-y-4">
              <Link to="/auth">
                <Button size="lg" className="bg-siplan-carmesim hover:bg-siplan-urucum text-white h-14 px-8 text-lg w-full md:w-auto">
                  🔹 Quero testar gratuitamente
                </Button>
              </Link>
              <div className="flex flex-wrap items-center gap-4 text-sm text-siplan-cinza">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-success" />
                  <span>1 análise gratuita</span>
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
            <div className="pt-4 border-t border-border">
              <p className="text-sm text-siplan-cinza-medio italic">
                Desenvolvido por especialistas em Direito Notarial e IA.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="bg-gradient-to-br from-siplan-cinza-medio/10 to-siplan-carmesim/10 rounded-2xl p-8 border-2 border-siplan-cinza-medio/20">
              <div className="bg-white rounded-lg shadow-2xl p-6 space-y-4">
                <div className="flex items-center gap-3 pb-4 border-b">
                  <FileSearch className="w-8 h-8 text-siplan-carmesim" />
                  <div>
                    <h3 className="font-semibold text-siplan-bordo">Análise em Tempo Real</h3>
                    <p className="text-sm text-siplan-cinza">Documento sendo processado...</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {[
                    { label: "Identificação de Partes", status: "ok" },
                    { label: "Verificação de Cláusulas", status: "ok" },
                    { label: "Análise de Riscos", status: "checking" },
                    { label: "Sugestões Automáticas", status: "pending" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span className="text-sm">{item.label}</span>
                      {item.status === "ok" && <CheckCircle className="w-5 h-5 text-success" />}
                      {item.status === "checking" && <Loader2 className="w-5 h-5 text-siplan-carmesim animate-spin" />}
                      {item.status === "pending" && <div className="w-5 h-5 rounded-full border-2 border-siplan-cinza-medio" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 2: ANTES E DEPOIS (Transformação) */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold font-merriweather text-siplan-bordo text-center mb-4">
              📑 Sua rotina cartorial antes e depois do SIPLAN IA
            </h2>
            <p className="text-center text-siplan-cinza mb-12 max-w-2xl mx-auto">
              Enquanto uns ainda carimbam papéis, outros já estão deixando a IA fazer o trabalho pesado — com mais eficiência e menos estresse.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Antes */}
              <Card className="border-2 border-destructive/20">
                <CardHeader className="bg-destructive/5">
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="w-6 h-6 text-destructive" />
                    <CardTitle className="text-2xl font-merriweather text-destructive">Antes</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  {[
                    "Pilhas de documentos e retrabalho",
                    "Atendimentos manuais e repetitivos",
                    "Risco de erro humano",
                    "Equipe sobrecarregada"
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <XCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                      <span className="text-siplan-cinza">{item}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Depois */}
              <Card className="border-2 border-success/40 shadow-lg">
                <CardHeader className="bg-success/5">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-6 h-6 text-success" />
                    <CardTitle className="text-2xl font-merriweather text-success">Depois</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  {[
                    "Análises automáticas e relatórios em segundos",
                    "Chatbot jurídico disponível 24h",
                    "Revisão automatizada com precisão",
                    "Mais tempo para o atendimento humano"
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                      <span className="text-siplan-cinza font-medium">{item}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 3: PROVA SOCIAL (Confiança) */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold font-merriweather text-siplan-bordo text-center mb-4">
              💬 Cartórios que já estão simplificando o trabalho com IA
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <Card className="border-2 hover:shadow-xl transition-all">
                <CardContent className="pt-6">
                  <div className="mb-4">
                    <div className="flex text-siplan-urucum mb-2">
                      {"⭐".repeat(5)}
                    </div>
                    <p className="text-lg text-siplan-cinza italic mb-4">
                      "O SIPLAN IA reduziu em 80% o tempo de conferência de escrituras. É como ter um assistente jurídico 24h."
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-siplan-carmesim/10 flex items-center justify-center">
                        <span className="font-bold text-siplan-carmesim">CA</span>
                      </div>
                      <div>
                        <p className="font-semibold text-siplan-bordo">Dr. Carlos Almeida</p>
                        <p className="text-sm text-siplan-cinza">2º Ofício de Notas – MG</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 hover:shadow-xl transition-all">
                <CardContent className="pt-6">
                  <div className="mb-4">
                    <div className="flex text-siplan-urucum mb-2">
                      {"⭐".repeat(5)}
                    </div>
                    <p className="text-lg text-siplan-cinza italic mb-4">
                      "No começo eu desconfiei. Mas hoje não abro mão. A IA aprende com nossos documentos e melhora toda semana."
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-siplan-carmesim/10 flex items-center justify-center">
                        <span className="font-bold text-siplan-carmesim">LF</span>
                      </div>
                      <div>
                        <p className="font-semibold text-siplan-bordo">Dra. Luciana Figueiredo</p>
                        <p className="text-sm text-siplan-cinza">Tabeliã – SP</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-12 text-center">
              <Badge variant="secondary" className="px-6 py-3 text-base">
                🚀 Seja um dos primeiros 20 cartórios do Brasil a testar o SIPLAN IA gratuitamente
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 4: DEMONSTRAÇÃO (AHA Moment) */}
      <section id="recursos" className="bg-gradient-to-br from-siplan-bordo/5 to-siplan-carmesim/5 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold font-merriweather text-siplan-bordo text-center mb-4">
              ⚙️ Veja o SIPLAN IA em ação — sem precisar entender de IA
            </h2>
            <p className="text-xl text-siplan-cinza text-center mb-12 max-w-3xl mx-auto">
              Faça upload de um documento e veja como a inteligência artificial identifica cláusulas, analisa riscos e sugere correções automáticas em segundos.
            </p>

            <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 mx-auto rounded-full bg-siplan-carmesim/10 flex items-center justify-center">
                    <FileText className="w-8 h-8 text-siplan-carmesim" />
                  </div>
                  <h3 className="font-bold text-siplan-bordo font-merriweather">1. Upload</h3>
                  <p className="text-sm text-siplan-cinza">Arraste seu documento PDF ou JPG</p>
                </div>
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 mx-auto rounded-full bg-siplan-carmesim/10 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-siplan-carmesim" />
                  </div>
                  <h3 className="font-bold text-siplan-bordo font-merriweather">2. Análise IA</h3>
                  <p className="text-sm text-siplan-cinza">A IA processa e identifica pontos críticos</p>
                </div>
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 mx-auto rounded-full bg-siplan-carmesim/10 flex items-center justify-center">
                    <BarChart3 className="w-8 h-8 text-siplan-carmesim" />
                  </div>
                  <h3 className="font-bold text-siplan-bordo font-merriweather">3. Relatório</h3>
                  <p className="text-sm text-siplan-cinza">Receba análise estruturada e acionável</p>
                </div>
              </div>
            </div>

            <div className="text-center space-y-4">
              <Button 
                size="lg" 
                className="bg-siplan-carmesim hover:bg-siplan-urucum text-white h-14 px-8"
                onClick={handleDemoLogin}
                disabled={isLoadingDemo}
              >
                {isLoadingDemo ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Criando demo...
                  </>
                ) : (
                  <>
                    📄 Fazer um teste gratuito
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
              <p className="text-siplan-cinza italic max-w-2xl mx-auto">
                Em menos de 1 minuto, você entende o que é ter um assistente digital que nunca erra, nunca cansa e trabalha 24h por você.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 5: PLANOS E PRECIFICAÇÃO */}
      <section id="planos" className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold font-merriweather text-siplan-bordo text-center mb-4">
              💼 Escolha o plano que combina com o ritmo do seu Cartório
            </h2>
            <p className="text-xl text-siplan-cinza text-center mb-12">
              Pague apenas pelo que usa — e pelo tempo que economiza.
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Free */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="font-merriweather">Free</CardTitle>
                  <div className="mt-4">
                    <span className="text-5xl font-bold text-siplan-bordo">R$ 0</span>
                    <span className="text-siplan-cinza">/mês</span>
                  </div>
                  <CardDescription className="mt-2">Ideal para testes iniciais</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-success" />
                      <span>1 análise gratuita/mês</span>
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
                      <XCircle className="w-5 h-5" />
                      <span>Suporte prioritário</span>
                    </li>
                  </ul>
                  <Link to="/auth" className="block">
                    <Button variant="outline" className="w-full">
                      Experimente Grátis
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Pro - Destaque */}
              <Card className="border-4 border-siplan-carmesim shadow-2xl relative scale-105">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-siplan-carmesim hover:bg-siplan-urucum text-white px-6 py-2 text-base">
                    ⭐ Mais Usado
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="font-merriweather">Pro</CardTitle>
                  <div className="mt-4">
                    <span className="text-5xl font-bold text-siplan-carmesim">R$ 199</span>
                    <span className="text-siplan-cinza">/mês</span>
                  </div>
                  <CardDescription className="mt-2">Ideal para cartórios de médio porte</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-success" />
                      <span className="font-medium">30 análises/mês</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-success" />
                      <span className="font-medium">Chatbot jurídico ilimitado</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-success" />
                      <span className="font-medium">IA GPT-5 Premium</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-success" />
                      <span className="font-medium">Suporte IA prioritário</span>
                    </li>
                  </ul>
                  <Link to="/auth" className="block">
                    <Button className="w-full bg-siplan-carmesim hover:bg-siplan-urucum text-white h-12">
                      Comece Agora
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Enterprise */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="font-merriweather">Enterprise</CardTitle>
                  <div className="mt-4">
                    <span className="text-5xl font-bold text-siplan-bordo">R$ 799</span>
                    <span className="text-siplan-cinza">+/mês</span>
                  </div>
                  <CardDescription className="mt-2">Ideal para grandes serventias</CardDescription>
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
                      <span className="font-medium">Treinamento personalizado</span>
                    </li>
                  </ul>
                  <Button variant="outline" className="w-full">
                    💬 Fale com um especialista
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 6: HUMANIZAÇÃO */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <h2 className="text-4xl md:text-5xl font-bold font-merriweather text-siplan-bordo mb-6">
                  👥 Por trás da tecnologia, pessoas que entendem o valor da confiança
                </h2>
                <p className="text-lg text-siplan-cinza leading-relaxed mb-6">
                  O SIPLAN IA nasceu da união entre especialistas em Direito Notarial e Registral e engenheiros de Inteligência Artificial. Nossa missão é preservar a tradição e a credibilidade do trabalho cartorial — automatizando o que é repetitivo e valorizando o que é essencialmente humano: a confiança.
                </p>
                <blockquote className="border-l-4 border-siplan-carmesim pl-6 py-4 bg-white rounded-r-lg">
                  <p className="text-2xl font-merriweather text-siplan-bordo italic">
                    "A tecnologia muda. A confiança, não."
                  </p>
                </blockquote>
              </div>
              <div className="order-1 md:order-2">
                <div className="bg-gradient-to-br from-siplan-bordo/10 to-siplan-carmesim/10 rounded-2xl p-8 border-2 border-siplan-cinza-medio/20">
                  <div className="bg-white rounded-lg p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { icon: Shield, label: "42 anos de expertise" },
                        { icon: FileText, label: "Direito Notarial" },
                        { icon: Sparkles, label: "IA de ponta" },
                        { icon: MessageCircle, label: "Suporte humano" }
                      ].map((item, i) => (
                        <div key={i} className="text-center p-4 bg-gray-50 rounded-lg">
                          <item.icon className="w-8 h-8 text-siplan-carmesim mx-auto mb-2" />
                          <p className="text-sm font-medium text-siplan-bordo">{item.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 7: CAPTAÇÃO DE LEADS (Beta MVP) */}
      <section id="beta" className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold font-merriweather text-siplan-bordo mb-4">
                  🚀 Faça parte da primeira geração de Cartórios Inteligentes do Brasil
                </h2>
                <p className="text-lg text-siplan-cinza mb-6">
                  Responda 3 perguntas rápidas e garanta acesso antecipado à versão Beta do SIPLAN IA:
                </p>
                
                <form onSubmit={handleBetaSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="cargo" className="text-siplan-bordo">Seu cargo no cartório</Label>
                    <Input 
                      id="cargo"
                      placeholder="Ex: Tabelião, Escrevente, Gerente..."
                      value={betaFormData.cargo}
                      onChange={(e) => setBetaFormData({...betaFormData, cargo: e.target.value})}
                      required
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="dificuldade" className="text-siplan-bordo">Sua principal dificuldade hoje</Label>
                    <Textarea 
                      id="dificuldade"
                      placeholder="Ex: Análise de documentos demorada, atendimento repetitivo..."
                      value={betaFormData.dificuldade}
                      onChange={(e) => setBetaFormData({...betaFormData, dificuldade: e.target.value})}
                      required
                      className="mt-2"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="sistema" className="text-siplan-bordo">Qual sistema usa atualmente?</Label>
                    <Select 
                      value={betaFormData.sistema}
                      onValueChange={(value) => setBetaFormData({...betaFormData, sistema: value})}
                      required
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="arisp">Arisp</SelectItem>
                        <SelectItem value="censec">Censec</SelectItem>
                        <SelectItem value="proprio">Sistema próprio</SelectItem>
                        <SelectItem value="planilhas">Planilhas</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button 
                    type="submit"
                    size="lg"
                    className="w-full bg-siplan-urucum hover:bg-siplan-carmesim text-white h-14 text-lg"
                  >
                    🧩 Quero participar do Beta gratuito
                  </Button>
                </form>

                <p className="text-sm text-siplan-cinza text-center mt-4 italic">
                  Ajude a moldar o futuro dos Cartórios com tecnologia feita para humanos, com humanos.
                </p>
              </div>

              <div className="bg-gradient-to-br from-siplan-bordo/5 to-siplan-carmesim/5 rounded-2xl p-8 border-2 border-siplan-cinza-medio/20">
                <div className="bg-white rounded-lg p-6">
                  <h3 className="text-2xl font-bold font-merriweather text-siplan-bordo mb-6">
                    Benefícios exclusivos do Beta
                  </h3>
                  <ul className="space-y-4">
                    {[
                      "Acesso antecipado a todas as funcionalidades",
                      "Período de teste estendido e gratuito",
                      "Influência direta no desenvolvimento do produto",
                      "Treinamento personalizado com a equipe técnica",
                      "Desconto especial ao migrar para plano pago",
                      "Suporte prioritário via WhatsApp"
                    ].map((benefit, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle className="w-6 h-6 text-success flex-shrink-0 mt-0.5" />
                        <span className="text-siplan-cinza">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 8: RODAPÉ */}
      <footer className="bg-siplan-bordo text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Selos de Confiança */}
            <div className="grid md:grid-cols-4 gap-8 mb-12 pb-12 border-b border-siplan-borgonha">
              {[
                { icon: Lock, text: "Segurança de dados nível bancário" },
                { icon: FileText, text: "Conformidade com LGPD" },
                { icon: Flag, text: "Tecnologia 100% brasileira" },
                { icon: MessageCircle, text: "Suporte humano via WhatsApp e E-mail" }
              ].map((item, i) => (
                <div key={i} className="text-center space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-full bg-siplan-carmesim/20 flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-sm text-siplan-cinza-medio">{item.text}</p>
                </div>
              ))}
            </div>

            {/* Links do Rodapé */}
            <div className="grid md:grid-cols-4 gap-8 mb-12">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-siplan-carmesim flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xl font-bold font-merriweather">SIPLAN IA</span>
                </div>
                <p className="text-sm text-siplan-cinza-medio leading-relaxed">
                  Hub de Inteligência Artificial para Cartórios
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Produto</h3>
                <ul className="space-y-2 text-sm text-siplan-cinza-medio">
                  <li><a href="#recursos" className="hover:text-white transition-colors">Recursos</a></li>
                  <li><a href="#planos" className="hover:text-white transition-colors">Planos</a></li>
                  <li><a href="#beta" className="hover:text-white transition-colors">Beta</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Empresa</h3>
                <ul className="space-y-2 text-sm text-siplan-cinza-medio">
                  <li><a href="#" className="hover:text-white transition-colors">Sobre</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Legal</h3>
                <ul className="space-y-2 text-sm text-siplan-cinza-medio">
                  <li><a href="#" className="hover:text-white transition-colors">Privacidade</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Termos</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">LGPD</a></li>
                </ul>
              </div>
            </div>

            {/* Assinatura Final */}
            <div className="text-center pt-8 border-t border-siplan-borgonha space-y-2">
              <p className="text-lg font-merriweather">
                Automatize o trabalho. Valorize o humano.
              </p>
              <p className="text-sm text-siplan-cinza-medio">
                © 2025 SIPLAN IA. Todos os direitos reservados.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
