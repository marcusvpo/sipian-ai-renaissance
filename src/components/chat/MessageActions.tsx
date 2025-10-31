import { Copy, RefreshCw, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

interface MessageActionsProps {
  content: string;
  onRegenerate?: () => void;
}

export const MessageActions = ({ content, onRegenerate }: MessageActionsProps) => {
  const { toast } = useToast();
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copiado!",
      description: "Resposta copiada para a área de transferência",
    });
  };

  const handleFeedback = (type: "up" | "down") => {
    setFeedback(type);
    toast({
      title: "Obrigado pelo feedback!",
      description: "Sua avaliação nos ajuda a melhorar",
    });
  };

  return (
    <div className="flex items-center gap-1 mt-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleCopy}
        className="h-8 px-2 text-gray-500 hover:text-gray-700"
      >
        <Copy className="w-4 h-4" />
      </Button>
      {onRegenerate && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onRegenerate}
          className="h-8 px-2 text-gray-500 hover:text-gray-700"
        >
          <RefreshCw className="w-4 h-4" />
        </Button>
      )}
      <div className="h-4 w-px bg-gray-300 mx-1" />
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleFeedback("up")}
        className={`h-8 px-2 ${
          feedback === "up" ? "text-siplan-carmesim" : "text-gray-500 hover:text-gray-700"
        }`}
      >
        <ThumbsUp className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleFeedback("down")}
        className={`h-8 px-2 ${
          feedback === "down" ? "text-siplan-carmesim" : "text-gray-500 hover:text-gray-700"
        }`}
      >
        <ThumbsDown className="w-4 h-4" />
      </Button>
    </div>
  );
};
