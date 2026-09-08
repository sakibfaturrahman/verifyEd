// src/features/issuance/components/wizard-stepper.tsx
"use client";

import { Check } from "lucide-react";

interface WizardStepperProps {
  currentStep: number;
  steps: string[];
}

export function WizardStepper({ currentStep, steps }: WizardStepperProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-4 shadow-xs">
      <div className="flex items-center justify-between max-w-3xl mx-auto">
        {steps.map((label, idx) => {
          const stepNum = idx + 1;
          const isCompleted = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;

          return (
            <div key={idx} className="flex items-center flex-1 last:flex-none">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold transition-colors ${
                    isCompleted
                      ? "bg-emerald-600 text-white"
                      : isCurrent
                        ? "bg-[#0e1738] dark:bg-zinc-100 text-white dark:text-[#0e1738]"
                        : "bg-slate-100 dark:bg-zinc-800 text-slate-400"
                  }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5" /> : stepNum}
                </div>
                <span
                  className={`text-xs font-semibold hidden sm:inline ${
                    isCurrent
                      ? "text-[#0e1738] dark:text-zinc-100 font-bold"
                      : "text-slate-400 dark:text-zinc-500"
                  }`}
                >
                  {label}
                </span>
              </div>

              {idx < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-4 transition-colors ${
                    stepNum < currentStep
                      ? "bg-emerald-600"
                      : "bg-slate-100 dark:bg-zinc-800"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
