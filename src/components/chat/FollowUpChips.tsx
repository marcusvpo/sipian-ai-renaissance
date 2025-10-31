import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface FollowUpChipsProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
}

export const FollowUpChips = ({ suggestions, onSelect }: FollowUpChipsProps) => {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="mt-4 space-y-2">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Sparkles className="w-4 h-4 text-siplan-carmesim" />
        <span className="font-medium">Perguntas relacionadas:</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => onSelect(suggestion)}
            className="text-sm border-gray-300 hover:border-siplan-carmesim hover:text-siplan-carmesim"
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  );
};
