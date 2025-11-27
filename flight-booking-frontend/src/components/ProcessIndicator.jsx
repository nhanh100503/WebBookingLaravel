const ProcessIndicator = ({ currentStep }) => {
  const steps = [
    { number: 1, label: 'お見積とフライト情報のご記入' }, //Enter your quote and flight information
    { number: 2, label: '利用者情報のご記入' }, //Enter user information
    { number: 3, label: '予約情報の確認' }, //Check reservation information
  ];

  return (
    <div className="flex justify-evenly w-[80%] mx-auto">
      {steps.map((step) => {
        const isActive = step.number === currentStep;
        return (
          <div key={step.number} className="flex items-center gap-2">
            <div
              className={`w-10 h-10 min-w-[2.5rem] min-h-[2.5rem] rounded-full flex items-center justify-center text-gray-600 font-bold flex-shrink-0 ${isActive ? 'bg-gray-300' : 'bg-white border-[2px] border-gray-300'
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

