import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Sparkles, Send, Loader2, User, Bot, ArrowLeft } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const Chat = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("chat-cartorial", {
        body: { messages: [...messages, userMessage] },
      });

      if (error) throw error;

      if (data?.message) {
        const assistantMessage: Message = {
          role: "assistant",
          content: data.message,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch (error: any) {
      console.error("Chat error:", error);
      toast({
        title: "Erro ao enviar mensagem",
        description: error.message || "Tente novamente",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-semibold">Chatbot Especialista</h1>
                <p className="text-xs text-muted-foreground">Legislação Cartorial Brasileira</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">10/10 chats</span>
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {messages.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Bot className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Como posso ajudar?</h2>
              <p className="text-muted-foreground mb-8">
                Pergunte sobre qualquer aspecto da legislação cartorial brasileira
              </p>
              <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                <Card 
                  className="p-4 cursor-pointer hover:border-primary/50 transition-all"
                  onClick={() => setInput("Quais são os requisitos para registro de imóvel?")}
                >
                  <p className="text-sm">Quais são os requisitos para registro de imóvel?</p>
                </Card>
                <Card 
                  className="p-4 cursor-pointer hover:border-primary/50 transition-all"
                  onClick={() => setInput("Como funciona a qualificação registral?")}
                >
                  <p className="text-sm">Como funciona a qualificação registral?</p>
                </Card>
                <Card 
                  className="p-4 cursor-pointer hover:border-primary/50 transition-all"
                  onClick={() => setInput("Explique sobre usucapião extrajudicial")}
                >
                  <p className="text-sm">Explique sobre usucapião extrajudicial</p>
                </Card>
                <Card 
                  className="p-4 cursor-pointer hover:border-primary/50 transition-all"
                  onClick={() => setInput("O que é uma matrícula imobiliária?")}
                >
                  <p className="text-sm">O que é uma matrícula imobiliária?</p>
                </Card>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-4 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-5 h-5 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border border-border"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                  {message.role === "user" && (
                    <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-secondary" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-primary" />
                  </div>
                  <div className="bg-card border border-border rounded-2xl p-4">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-card sticky bottom-0">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua pergunta..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="bg-gradient-to-r from-primary to-primary-hover"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            A IA pode cometer erros. Sempre verifique informações importantes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chat;
