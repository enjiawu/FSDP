import React, { useState } from 'react';
import '../../css/table.css';

// Define the interface for a test case
interface TestCase {
  id: number;
  title: string;
  description: string;
  timeTaken: number; // Time taken in seconds
  status: 'Passed' | 'Failed' | 'Pending';
}

const testCases: TestCase[] = [
  {
    id: 1,
    title: 'Login Functionality Test',
    description: 'This test verifies that the login functionality works as expected.',
    timeTaken: 120,
    status: 'Passed',
  },
  {
    id: 2,
    title: 'Sign Up Functionality Test',
    description: 'This test checks if new users can sign up successfully and receive confirmation.',
    timeTaken: 150,
    status: 'Failed',
  },
  {
    id: 3,
    title: 'Password Reset Test',
    description: 'Verifies that users can reset their passwords successfully using the reset link.',
    timeTaken: 90,
    status: 'Passed',
  },
  {
    id: 4,
    title: 'Profile Update Test',
    description: 'This test ensures that users can update their profile information without issues.',
    timeTaken: 60,
    status: 'Pending',
  },
];

const TestCaseTable = () => {
  const [modalContent, setModalContent] = useState<{ title: string; description: string; status: string; timeTaken: number } | null>(null);
  const [tooltipContent, setTooltipContent] = useState<string | null>(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  const handleDescriptionClick = (testCase: TestCase) => {
    setModalContent({
      title: testCase.title,
      description: testCase.description,
      status: testCase.status,
      timeTaken: testCase.timeTaken,
    });
  };

  const closeModal = () => {
    setModalContent(null);
  };

  const showTooltip = (event: React.MouseEvent<HTMLDivElement>, description: string) => {
    setTooltipContent(description);
    setTooltipVisible(true);
    setTooltipPosition({ top: event.clientY + 10, left: event.clientX + 10 });
  };

  const hideTooltip = () => {
    setTooltipVisible(false);
  };

  return (
    <div>
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[50px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">ID</th>
                <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white">Test Case</th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">Description</th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">Time Taken (s)</th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">Status</th>
              </tr>
            </thead>
            <tbody>
              {testCases.map((testCase) => (
                <tr key={testCase.id}>
                  <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                    <h5 className="font-medium text-black dark:text-white">{testCase.id}</h5>
                  </td>
                  <td
                    className="border-b border-[#eee] py-5 px-4 dark:border-strokedark cursor-pointer font-medium text-blue-600 hover:underline"
                    onClick={() => handleDescriptionClick(testCase)} // Open modal on click
                  >
                    {testCase.title}
                  </td>
                  <td
                    className="border-b border-[#eee] py-5 px-4 dark:border-strokedark cursor-pointer"
                    onMouseEnter={(e) => showTooltip(e, testCase.description)}
                    onMouseLeave={hideTooltip}
                  >
                    <div className="max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
                      {testCase.description.length > 50
                        ? `${testCase.description.substring(0, 50)}...`
                        : testCase.description}
                    </div>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">{testCase.timeTaken}</p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p
                      className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
                        testCase.status === 'Passed'
                          ? 'bg-success text-success'
                          : testCase.status === 'Failed'
                          ? 'bg-danger text-danger'
                          : 'bg-warning text-warning'
                      }`}
                    >
                      {testCase.status}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tooltip */}
      {tooltipVisible && tooltipContent && (
        <div
          className="absolute bg-black text-white text-sm rounded p-2"
          style={{ top: tooltipPosition.top, left: tooltipPosition.left }}
        >
          {tooltipContent}
        </div>
      )}

      {/* Modal for test case details */}
      {modalContent && (
        <div className="fixed inset-0 flex items-center justify-center" onClick={closeModal}>
          <div className="bg-white p-4 rounded shadow-lg" onClick={(e) => e.stopPropagation()}>
            <h5 className="font-medium">{modalContent.title}</h5>
            <p><strong>Description:</strong> {modalContent.description}</p>
            <p><strong>Status:</strong> {modalContent.status}</p>
            <p><strong>Time Taken:</strong> {modalContent.timeTaken} seconds</p>
            <button
              className="mt-2 px-4 py-2 text-white bg-blue-500 rounded"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestCaseTable;
