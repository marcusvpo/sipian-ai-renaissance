import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface ThinkingStepsProps {
  onComplete: () => void;
}

const steps = [
  { text: "Analisando sua pergunta...", duration: 2000 },
  { text: "Pesquisando na base de Provimentos do CNJ...", duration: 3000 },
  { text: "Consultando a base de 42 anos de dados da Siplan...", duration: 2000 },
  { text: "Sintetizando a resposta e buscando fundamentos legais...", duration: 2000 },
];

export const ThinkingSteps = ({ onComplete }: ThinkingStepsProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (currentStep < steps.length) {
      const timer = setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, steps[currentStep].duration);
      return () => clearTimeout(timer);
    } else {
      onComplete();
    }
  }, [currentStep, onComplete]);

  return (
    <div className="space-y-3 py-2">
      {steps.map((step, index) => (
        <div
          key={index}
          className={`flex items-center gap-3 transition-opacity ${
            index <= currentStep ? "opacity-100" : "opacity-30"
          }`}
        >
          {index === currentStep ? (
            <Loader2 className="w-4 h-4 animate-spin text-siplan-carmesim flex-shrink-0" />
          ) : index < currentStep ? (
            <div className="w-4 h-4 rounded-full bg-siplan-carmesim flex items-center justify-center flex-shrink-0">
              <svg className="w-3 h-3 text-white" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          ) : (
            <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex-shrink-0" />
          )}
          <span className="text-sm text-gray-600">{step.text}</span>
        </div>
      ))}
    </div>
  );
};
