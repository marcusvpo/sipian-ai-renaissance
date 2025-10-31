import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { 
  ArrowLeft, 
  Upload, 
  FileText, 
  Loader2,
  CheckCircle2,
  AlertCircle,
  XCircle
} from "lucide-react";
import type { User } from "@supabase/supabase-js";

const Analyzer = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Tipo de arquivo inválido",
          description: "Por favor, selecione um PDF ou imagem (JPG/PNG)",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
      setAnalysisResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    
    try {
      // Simulate analysis for MVP
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock result
      setAnalysisResult({
        status: "success",
        documentType: "Matrícula Imobiliária",
        issues: [
          { type: "success", message: "Documento autenticado corretamente" },
          { type: "success", message: "Assinaturas válidas detectadas" },
          { type: "warning", message: "Verificar data de emissão (mais de 90 dias)" },
          { type: "error", message: "Falta certidão de regularidade fiscal" },
        ],
        confidence: 85,
      });

      toast({
        title: "Análise concluída!",
        description: "Confira os resultados abaixo",
      });
    } catch (error: any) {
      toast({
        title: "Erro na análise",
        description: error.message || "Tente novamente",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getStatusIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="w-5 h-5 text-success" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-warning" />;
      case "error":
        return <XCircle className="w-5 h-5 text-destructive" />;
      default:
        return null;
    }
  };

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
              <h1 className="font-semibold">Analisador de Documentos</h1>
              <p className="text-xs text-muted-foreground">Upload e análise inteligente com IA</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">5/5 análises</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid gap-6">
          {/* Upload Card */}
          <Card>
            <CardHeader>
              <CardTitle>Enviar Documento</CardTitle>
              <CardDescription>
                Suportamos PDF, JPG e PNG. Máximo 10MB.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileSelect}
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center gap-4"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Upload className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium mb-1">
                        Clique para selecionar ou arraste o arquivo
                      </p>
                      <p className="text-sm text-muted-foreground">
                        PDF, JPG ou PNG até 10MB
                      </p>
                    </div>
                  </label>
                </div>

                {selectedFile && (
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium text-sm">{selectedFile.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={handleAnalyze}
                      disabled={isAnalyzing}
                      className="bg-gradient-to-r from-primary to-primary-hover"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Analisando...
                        </>
                      ) : (
                        "Analisar Documento"
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Results Card */}
          {analysisResult && (
            <Card>
              <CardHeader>
                <CardTitle>Resultado da Análise</CardTitle>
                <CardDescription>
                  Tipo: {analysisResult.documentType} | Confiança: {analysisResult.confidence}%
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysisResult.issues.map((issue: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                    >
                      {getStatusIcon(issue.type)}
                      <p className="text-sm flex-1">{issue.message}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex gap-2">
                  <Button variant="outline" className="flex-1">
                    Exportar Relatório
                  </Button>
                  <Button className="flex-1 bg-gradient-to-r from-primary to-primary-hover">
                    Nova Análise
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Info Card */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-primary mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium mb-1">Plano Free</p>
                  <p className="text-muted-foreground">
                    Você tem 5 análises gratuitas por mês. Upgrade para Pro e tenha 100 análises mensais com IA GPT-5 Premium e sugestões automáticas de exigências.
                  </p>
                  <Link to="/#pricing">
                    <Button variant="link" className="px-0 h-auto mt-2 text-primary">
                      Ver planos →
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Analyzer;
