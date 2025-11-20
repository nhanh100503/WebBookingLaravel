const ProcessIndicator = ({ currentStep }) => {
  const steps = [
    { number: 1, label: 'Enter your quote and flight information' },
    { number: 2, label: 'Enter user information' },
    { number: 3, label: 'Check reservation information' },
  ];

  return (
    <div className="flex justify-around w-full mb-8">
      {steps.map((step) => {
        const isActive = step.number === currentStep;
        return (
          <div key={step.number} className="flex items-center gap-2">
            <div
              className={`w-10 h-10 min-w-[2.5rem] min-h-[2.5rem] rounded-full flex items-center justify-center text-gray-600 font-bold flex-shrink-0 ${isActive ? 'bg-gray-200' : 'bg-white border border-gray-300'
                }`}
            >
              {step.number}
            </div>
            <span className="text-gray-600 text-sm whitespace-pre-line">
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default ProcessIndicator;

