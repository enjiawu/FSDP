import React, { useState } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import NoCodeTestCaseInput from '../components/NoCode/NoCodeTestCaseInput';

const NoCode: React.FC = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [isGenerated, setIsGenerated] = useState(false);

  // Callback to enable Step 2 once the test case is generated
  const handleGenerated = () => {
    setIsGenerated(true);
    setActiveStep(2); // Optionally move to Step 2 immediately upon generation
  };

  return (
    <>
      <Breadcrumb pageName="No Code Test Case Creation" />
      
      {/* Parent Container */}
      <div className="flex flex-col w-full h-full p-6 bg-white border border-gray-300 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700 cursor-pointer">
        
        {/* Navigation Section */}
        <div className="flex w-full bg-gray-100 border-b border-gray-300 dark:bg-gray-700 dark:border-gray-600">
          <button
            className={`flex-1 text-center py-2 ${
              activeStep === 1
                ? 'bg-blue-500 text-white font-bold'
                : 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300'
            }`}
            onClick={() => setActiveStep(1)}
          >
            Step 1: Generate Test Case
          </button>
          <button
            className={`flex-1 text-center py-2 ${
              activeStep === 2 && isGenerated
                ? 'bg-blue-500 text-white font-bold'
                : 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300'
            }`}
            onClick={() => isGenerated && setActiveStep(2)}
            disabled={!isGenerated}
          >
            Step 2: Refine Test Case
          </button>
        </div>


        <NoCodeTestCaseInput />
      </div>      
    </>
  );
};

export default NoCode;
