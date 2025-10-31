import { FileText, Scale, BookOpen } from "lucide-react";

interface Source {
  type: "DOCUMENTO" | "LEI" | "BASE INTERNA";
  title: string;
  reference?: string;
}

interface SourcesCardProps {
  sources: Source[];
}

const getSourceIcon = (type: Source["type"]) => {
  switch (type) {
    case "DOCUMENTO":
      return <FileText className="w-4 h-4 text-siplan-carmesim" />;
    case "LEI":
      return <Scale className="w-4 h-4 text-siplan-carmesim" />;
    case "BASE INTERNA":
      return <BookOpen className="w-4 h-4 text-siplan-carmesim" />;
  }
};

export const SourcesCard = ({ sources }: SourcesCardProps) => {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-4 p-4 bg-gray-100/50 border border-gray-200 rounded-lg">
      <h4 className="font-semibold text-sm text-gray-900 mb-3 flex items-center gap-2">
        <BookOpen className="w-4 h-4 text-siplan-carmesim" />
        Fundamentos e Fontes
      </h4>
      <div className="space-y-2">
        {sources.map((source, index) => (
          <div key={index} className="flex items-start gap-2 text-sm">
            <span className="text-gray-500 font-medium">{index + 1}.</span>
            <div className="flex items-start gap-2 flex-1">
              {getSourceIcon(source.type)}
              <div>
                <span className="font-medium text-gray-700">[{source.type}]</span>{" "}
                <span className="text-gray-600">{source.title}</span>
                {source.reference && (
                  <span className="text-gray-500"> - {source.reference}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
