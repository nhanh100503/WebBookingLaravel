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
        const isCompleted = step.number < currentStep;
        return (
          <div key={step.number} className="flex items-center gap-2">
            <div
              className={`w-10 h-10 min-w-[2.5rem] min-h-[2.5rem] rounded-full flex items-center justify-center text-gray-600 font-bold flex-shrink-0 ${isCompleted
                ? 'bg-gray-500 border-[2px] border-gray-500'
                : isActive
                  ? 'bg-gray-300'
                  : 'bg-white border-[2px] border-gray-300'
                }`}
            >
              {isCompleted ? (
                //make the svg bolder and border-width-2
                <svg className="w-5 h-5 text-white border-width-2 border-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                step.number
              )}
            </div>
            <span className="text-gray-600 text-base whitespace-pre-line">
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default ProcessIndicator;

