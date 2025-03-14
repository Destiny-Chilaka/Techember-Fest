 import React from "react";

const ProgressHeader = ({ currentStep, totalSteps}) => {
  
const progress = ((currentStep) / (totalSteps )) * 100;
const getHeaderText = () => {
  switch (currentStep) {
    case 1:
      return "Ticket Selection";
    case 2:
      return "Attendee Details";
    case 3:
      return "Ready";
    default:
      return "Ticket Selection"; // Default to Step 1 text
  }
};

  return (
    <div className="text-white py-3 mb-4">
      <div className="flex flex-col sm:flex-row sm:justify-between items-start mb-2">
        <h2 className="text-xl md:text-2xl font-light baskervville">{getHeaderText()}</h2>
        <span className="text-sm font-light ">Step {currentStep}/{totalSteps}</span>
      </div>
      <div className="relative h-1 bg-[#0E464F] rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-[#24A0B5] transition-all duration-300 ease-in-out rounded-full"
        style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

 export default ProgressHeader;
