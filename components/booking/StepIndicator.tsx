import { Check } from "lucide-react";
import { cn } from "@/app/lib/utils";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
  isRTL: boolean;
}

export default function StepIndicator({ currentStep, totalSteps, labels, isRTL }: StepIndicatorProps) {
  return (
    <div className={cn("flex items-center justify-between gap-1", isRTL && "flex-row-reverse")}>
      {Array.from({ length: totalSteps }, (_, i) => {
        const stepNum = i + 1;
        const isDone = stepNum < currentStep;
        const isActive = stepNum === currentStep;

        return (
          <div key={stepNum} className={cn("flex-1 flex flex-col items-center gap-1.5", isRTL && "items-center")}>
            <div className="relative flex items-center w-full">
              {/* Line before */}
              {i > 0 && (
                <div className={cn("flex-1 h-px transition-colors duration-300", isDone || isActive ? "bg-gold/60" : "bg-white/10")} />
              )}
              {/* Circle */}
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300 shrink-0",
                  isDone
                    ? "bg-gold border-gold text-black"
                    : isActive
                    ? "border-gold text-gold bg-gold/10"
                    : "border-white/10 text-cream/30 bg-transparent"
                )}
              >
                {isDone ? <Check className="w-4 h-4" /> : stepNum}
              </div>
              {/* Line after */}
              {i < totalSteps - 1 && (
                <div className={cn("flex-1 h-px transition-colors duration-300", isDone ? "bg-gold/60" : "bg-white/10")} />
              )}
            </div>
            <span
              className={cn(
                "text-[10px] font-medium transition-colors duration-300 text-center hidden sm:block",
                isActive ? "text-gold" : isDone ? "text-gold/60" : "text-cream/20"
              )}
            >
              {labels[i]}
            </span>
          </div>
        );
      })}
    </div>
  );
}
