
interface FormStep {
  label: string;
  completed: boolean;
}

interface FormProgressProps {
  currentStep: number;
  totalSteps: number;
  steps?: FormStep[];
}

export function FormProgress({ currentStep, totalSteps, steps }: FormProgressProps) {
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
      
      {steps && (
        <div className="mt-4 grid grid-cols-7 gap-2">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="flex flex-col items-center"
            >
              <div 
                className={`w-full h-1 ${index < currentStep ? 'bg-primary' : 'bg-slate-200'}`}
              />
              <div 
                className={`w-4 h-4 rounded-full mt-1 flex items-center justify-center text-xs
                  ${step.completed ? 'bg-green-500 text-white' : 
                    index === currentStep - 1 ? 'bg-primary text-white' : 'bg-slate-200 text-slate-500'}`}
              >
                {step.completed ? '✓' : ''}
              </div>
              <span className="text-xs text-center mt-1 text-slate-600 truncate w-full">
                {step.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
