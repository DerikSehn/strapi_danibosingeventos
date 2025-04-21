import StepperComponent from '@/components/ui/stepper';
import React, { useState } from 'react';

interface Step {
  title: string;
  description: string;
  content: React.ReactNode;
}

export const useFormStepper = (steps: Step[]) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nextStep = () => setStep((prevStep) => Math.min(prevStep + 1, steps.length));
  const previousStep = () => setStep((prevStep) => Math.max(prevStep - 1, 1));


  return { step, isSubmitting, setIsSubmitting, nextStep, previousStep, Stepper: StepperComponent as unknown as typeof StepperComponent}
};
