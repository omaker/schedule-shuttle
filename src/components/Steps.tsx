import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface Step {
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

interface StepsProps {
  steps: Step[];
  currentStep: number;
  onStepChange: (step: number) => void;
}

export const Steps = ({ steps, currentStep, onStepChange }: StepsProps) => {
  return (
    <div className="w-full">
      <nav aria-label="Progress">
        <ol className="flex items-center justify-center space-x-8">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;

            return (
              <li key={step.title} className="relative">
                <button
                  onClick={() => onStepChange(index)}
                  className={cn(
                    "group flex flex-col items-center text-sm font-medium",
                    isCompleted || isCurrent
                      ? "cursor-pointer"
                      : "cursor-not-allowed opacity-50"
                  )}
                  disabled={!isCompleted && !isCurrent}
                >
                  <span className="flex items-center">
                    <span
                      className={cn(
                        "relative flex h-12 w-12 items-center justify-center rounded-full",
                        isCompleted
                          ? "bg-mint-500"
                          : isCurrent
                          ? "border-2 border-mint-500 bg-white"
                          : "border-2 border-gray-300 bg-white"
                      )}
                    >
                      {isCompleted ? (
                        <Check className="h-6 w-6 text-white" />
                      ) : (
                        <span
                          className={cn(
                            "h-6 w-6",
                            isCurrent ? "text-mint-500" : "text-gray-500"
                          )}
                        >
                          {step.icon}
                        </span>
                      )}
                    </span>
                  </span>
                  <span
                    className={cn(
                      "mt-2 font-semibold",
                      isCurrent ? "text-mint-500" : "text-gray-500"
                    )}
                  >
                    {step.title}
                  </span>
                </button>

                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "absolute left-full top-6 -ml-4 w-8 h-0.5",
                      isCompleted ? "bg-mint-500" : "bg-gray-300"
                    )}
                    style={{ transform: "translateX(-50%)" }}
                  />
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
};