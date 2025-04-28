
interface FormProgressProps {
  currentStep: number;
  totalSteps: number;
}

export function FormProgress({ currentStep, totalSteps }: FormProgressProps) {
  const progress = (currentStep / totalSteps) * 100;
  
  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-sm text-slate-500">
        <span>Progress</span>
        <span>{Math.round(progress)}% complete</span>
      </div>
      <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-300 ease-in-out" 
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
