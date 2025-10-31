import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Sparkles, Send, User, Bot, ArrowLeft } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { ThinkingSteps } from "@/components/chat/ThinkingSteps";
import { SourcesCard } from "@/components/chat/SourcesCard";
import { MessageActions } from "@/components/chat/MessageActions";
import { FollowUpChips } from "@/components/chat/FollowUpChips";
import { MarkdownRenderer } from "@/components/chat/MarkdownRenderer";

interface Source {
  type: "DOCUMENTO" | "LEI" | "BASE INTERNA";
  title: string;
  reference?: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
  followUps?: string[];
  isThinking?: boolean;
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

    // Add thinking message
    const thinkingMessage: Message = {
      role: "assistant",
      content: "",
      isThinking: true,
    };
    setMessages((prev) => [...prev, thinkingMessage]);

    try {
      const { data, error } = await supabase.functions.invoke("chat-cartorial", {
        body: { messages: [...messages, userMessage] },
      });

      if (error) throw error;

      // Remove thinking message and add real response
      setMessages((prev) => prev.filter((m) => !m.isThinking));

      if (data?.message) {
        const assistantMessage: Message = {
          role: "assistant",
          content: data.message,
          sources: data.sources || [
            {
              type: "DOCUMENTO",
              title: "Provimento CNJ 143/2023",
              reference: "Art. 5",
            },
            {
              type: "LEI",
              title: "Lei de Registros Públicos - Lei 6.015/73",
              reference: "Art. 172",
            },
            {
              type: "BASE INTERNA",
              title: "Base de Conhecimento Siplan: 'Exigências Comuns TJ-SP'",
            },
          ],
          followUps: data.followUps || [
            "Como proceder em casos excepcionais?",
            "Quais documentos são necessários?",
            "Me mostre um exemplo prático",
          ],
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch (error: any) {
      console.error("Chat error:", error);
      setMessages((prev) => prev.filter((m) => !m.isThinking));
      toast({
        title: "Erro ao enviar mensagem",
        description: error.message || "Tente novamente",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = async () => {
    if (messages.length < 2) return;
    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUserMessage) return;
    
    // Remove last assistant message
    setMessages((prev) => {
      const lastAssistantIndex = [...prev].reverse().findIndex((m) => m.role === "assistant");
      if (lastAssistantIndex === -1) return prev;
      const actualIndex = prev.length - 1 - lastAssistantIndex;
      return prev.slice(0, actualIndex);
    });

    // Resend
    setInput(lastUserMessage.content);
    setTimeout(() => handleSend(), 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-200 bg-siplan-bordo sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="text-white hover:bg-siplan-borgonha">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-siplan-carmesim flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-white">Consultor Geral</h1>
                <p className="text-xs text-gray-300">Pesquisa e Descoberta Legal</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-300">10/10 consultas</span>
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {messages.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-2xl bg-siplan-carmesim/10 flex items-center justify-center mx-auto mb-6">
                <Bot className="w-8 h-8 text-siplan-carmesim" />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-gray-900">Como posso ajudar?</h2>
              <p className="text-gray-600 mb-8">
                Pergunte sobre qualquer aspecto da legislação cartorial brasileira
              </p>
              <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                <Card 
                  className="p-4 cursor-pointer hover:border-siplan-carmesim/50 transition-all bg-white"
                  onClick={() => setInput("Quais são os requisitos para registro de imóvel?")}
                >
                  <p className="text-sm text-gray-700">Quais são os requisitos para registro de imóvel?</p>
                </Card>
                <Card 
                  className="p-4 cursor-pointer hover:border-siplan-carmesim/50 transition-all bg-white"
                  onClick={() => setInput("Como funciona a qualificação registral?")}
                >
                  <p className="text-sm text-gray-700">Como funciona a qualificação registral?</p>
                </Card>
                <Card 
                  className="p-4 cursor-pointer hover:border-siplan-carmesim/50 transition-all bg-white"
                  onClick={() => setInput("Explique sobre usucapião extrajudicial")}
                >
                  <p className="text-sm text-gray-700">Explique sobre usucapião extrajudicial</p>
                </Card>
                <Card 
                  className="p-4 cursor-pointer hover:border-siplan-carmesim/50 transition-all bg-white"
                  onClick={() => setInput("O que é uma matrícula imobiliária?")}
                >
                  <p className="text-sm text-gray-700">O que é uma matrícula imobiliária?</p>
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
                    <div className="w-8 h-8 rounded-lg bg-siplan-carmesim/10 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-5 h-5 text-siplan-carmesim" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] ${
                      message.role === "user" ? "" : "w-full max-w-3xl"
                    }`}
                  >
                    <div
                      className={`rounded-2xl p-4 ${
                        message.role === "user"
                          ? "bg-gray-400 text-white"
                          : "bg-white border border-gray-200"
                      }`}
                    >
                      {message.isThinking ? (
                        <ThinkingSteps onComplete={() => {}} />
                      ) : (
                        <>
                          <MarkdownRenderer content={message.content} />
                          {message.sources && <SourcesCard sources={message.sources} />}
                        </>
                      )}
                    </div>
                    {message.role === "assistant" && !message.isThinking && (
                      <>
                        <MessageActions 
                          content={message.content} 
                          onRegenerate={index === messages.length - 1 ? handleRegenerate : undefined}
                        />
                        {message.followUps && (
                          <FollowUpChips 
                            suggestions={message.followUps} 
                            onSelect={(suggestion) => {
                              setInput(suggestion);
                              setTimeout(() => handleSend(), 100);
                            }}
                          />
                        )}
                      </>
                    )}
                  </div>
                  {message.role === "user" && (
                    <div className="w-8 h-8 rounded-lg bg-gray-300 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-gray-600" />
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white sticky bottom-0">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua pergunta..."
              disabled={isLoading}
              className="flex-1 border-gray-300 focus:border-siplan-carmesim"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="bg-siplan-carmesim hover:bg-siplan-urucum text-white"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            A IA pode cometer erros. Sempre verifique informações importantes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chat;
