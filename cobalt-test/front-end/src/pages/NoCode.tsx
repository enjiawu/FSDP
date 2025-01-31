import React, { useState, useEffect } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import NoCodeTestCaseInput from '../components/NoCode/NoCodeTestCaseInput';
import NoCodeTestCaseOutput from '../components/NoCode/NoCodeTestCaseOutput';

const NoCode: React.FC = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [isGenerated, setIsGenerated] = useState(false);
  const [showOtherComponent, setShowOtherComponent] = useState(false);
  const [generatedTestCase, setGeneratedTestCase] = useState<string | null>(null);
  const [testCaseDetails, setTestCaseDetails] = useState({
    testCaseName: '',
    testCaseDescription: '',
    testCaseApplication: '',
    testCaseSteps: '',
    testCaseExpectedResults: ''
  });

  // Callback to enable Step 2 once the test case is generated
  const handleTestCaseGeneration  = (testCase: string, details: any) => {
    setGeneratedTestCase(testCase);
    setTestCaseDetails(details);
    setIsGenerated(true);
    setShowOtherComponent(true); // Navigate to the other component
    setActiveStep(2); // Optionally move to Step 2 immediately upon generation
  };

  const [userRole, setUserRole] = useState<string | null>(null);
  const [assignedApps, setAssignedApps] = useState<string[]>([]);
  useEffect(() => {
      const fetchUserDetails = async () => {
      try {
          const token = localStorage.getItem('token'); // Retrieve the token from localStorage
          const decodedToken = token
          ? JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
          : null;
          const role = decodedToken?.role; // Assuming the role is included in the token
          setUserRole(role);

          const username = decodedToken?.username;

          if (username) {
          const response = await fetch(`http://localhost:3000/assignedApps/${username}`, {
              method: 'GET',
              headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
              },
          });

          if (!response.ok) {
              throw new Error(`Error fetching assigned apps: ${response.statusText}`);
          }

          const data = await response.json();
          setAssignedApps(data);
          }
      } catch (error) {
          console.error('Error fetching user details:', error);
      }
      };

      fetchUserDetails();
  }, []);

  // Show loading state if userRole or assignedApps are still being fetched
  if (userRole === null || (userRole === null && assignedApps.length === 0)) {
      return <div className="text-center mt-10 text-lg font-semibold">You are currently accessing this platform as a restricted user. If you are assigned to any application that you are managing, please contact OCBC Helpdesk for further assistance.</div>;
  }

  return (
    <>
      <Breadcrumb pageName="No Code Test Case Creation" />

      {/* Navigation Section */}
      <div className="flex w-full bg-gray-100 border-b border-gray-300 dark:bg-gray-700 dark:border-gray-600 rounded-t-lg">
        <button
          className={`rounded-tl-lg flex-1 text-center py-4 ${
            activeStep === 1
              ? 'bg-primary text-white font-bold'
              : 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300'
          }`}
          onClick={() => setActiveStep(1)}
        >
          Step 1: Generate Test Case
        </button>
        <button
          className={`rounded-tr-lg flex-1 text-center py-4 ${
            activeStep === 2
              ? 'bg-primary text-white font-bold'
              : 'bg-gray-200 dark:bg-gray-600'
          } ${isGenerated ? '' : 'cursor-not-allowed'}`}
          onClick={() => isGenerated && setActiveStep(2)}
          disabled={!isGenerated}
        >
          Step 2: Refine Test Case
        </button>
      </div>

      {/* Parent Container */}
      <div className="flex flex-col w-full h-full p-6 bg-white border border-gray-300 rounded-b-lg shadow-lg dark:bg-gray-800 dark:border-gray-700 cursor-pointer">
        {activeStep === 1 || !showOtherComponent ? (
           <NoCodeTestCaseInput setGeneratedTestCase={handleTestCaseGeneration} />
        ) : (
          <NoCodeTestCaseOutput 
            generatedTestCase={generatedTestCase} 
            testCaseDetails={testCaseDetails}
        />
        )}
      </div>
    </>
  );
};

export default NoCode;
