import React, { useState } from 'react';
import '../../css/general.css';
import DropdownSortBy from '../Dropdowns/DropdownSortBy';

// Define the interface for a test case
interface TestCase {
  id: number;
  title: string;
  description: string;
  timeTaken: number; // Time taken in seconds
  errorMessage?: string;
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
    errorMessage: 'Email already exists',
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
  {
    id: 5,
    title: 'Logout Functionality Test',
    description: 'This test ensures that users can log out successfully.',
    timeTaken: 45,
    status: 'Passed',
  },
  {
    id: 6,
    title: 'Search Functionality Test',
    description: 'Verifies that the search functionality returns accurate results.',
    timeTaken: 110,
    status: 'Failed',
    errorMessage: 'Search results are not displayed correctly',
  },
  {
    id: 7,
    title: 'Add to Cart Test',
    description: 'Checks if items can be added to the shopping cart.',
    timeTaken: 75,
    status: 'Pending',
  },
  {
    id: 8,
    title: 'Checkout Process Test',
    description: 'Ensures that users can complete the checkout process.',
    timeTaken: 200,
    status: 'Passed',
  },
  {
    id: 9,
    title: 'Payment Gateway Test',
    description: 'Verifies that the payment gateway processes payments correctly.',
    timeTaken: 180,
    status: 'Failed',
    errorMessage: 'Payment failed due to network error',
  },
  {
    id: 10,
    title: 'User Profile Picture Upload Test',
    description: 'Checks if users can upload and update their profile pictures.',
    timeTaken: 50,
    status: 'Passed',
  },
];

const TestCaseTable = () => {
  const [modalContent, setModalContent] = useState<{ title: string; description: string; status: string; timeTaken: number, errorMessage?:string} | null>(null);
  const [tooltipContent, setTooltipContent] = useState<string | null>(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [filter, setFilter] = useState<'All' | 'Passed' | 'Failed' | 'Pending'>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTestCases = testCases.filter(testCase =>
    (filter === 'All' || testCase.status === filter) &&
    testCase.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDescriptionClick = (testCase: TestCase) => {
    setModalContent({
      title: testCase.title,
      description: testCase.description,
      status: testCase.status,
      timeTaken: testCase.timeTaken,
      errorMessage: testCase.errorMessage,
    });
  };

  const closeModal = () => {
    setModalContent(null);
  };

  const showTooltip = (event: React.MouseEvent<HTMLElement>, content: string) => {
    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    
    setTooltipContent(content);
    setTooltipVisible(true);
    
    // Position the tooltip right above the text and centered horizontally
    setTooltipPosition({
      top: rect.top + window.scrollY - 20, 
      left: rect.left + window.scrollX + rect.width / 2 - 400, // Adjusted to center the tooltip
    });
  };
  

  const hideTooltip = () => {
    setTooltipVisible(false);
  };

  return (
    <div className="rounded-md bg-white p-6 shadow-md dark:border-strokedark dark:bg-boxdark">
      <div className="flex justify-between items-center mb-4">
        <div 
          className="relative" 
          onMouseEnter={(e) => showTooltip(e, "Test cases are sorted by the sequence of execution, from first to last.")}
          onMouseLeave={hideTooltip}
        >
          <h2 className="text-xl font-semibold dark:text-white">Test Case Status</h2>
        </div>
        <div className="flex items-center">
            <div className="relative mr-4">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg
                className="h-5 w-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1116.65 2a7.5 7.5 0 010 14.65z"
                />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search Test Cases..."
                className="border border-gray-400 rounded p-2 pl-10 pr-15 dark:bg-black dark:text-white"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          <DropdownSortBy 
            value={filter}
            onChange={(value) => setFilter(value as 'Passed' | 'Failed' | 'Pending' | 'All')}
            options={
              [{ value: 'All', label: 'All' },
                { value: 'Passed', label: 'Passed' },
                { value: 'Failed', label: 'Failed' },
                { value: 'Pending', label: 'Pending' },]
            }
          />
        </div>
      </div>

      <div className="max-w-full overflow-x-auto overflow-auto h-100">
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
            {filteredTestCases.map((testCase) => (
              <tr key={testCase.id}>
                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">{testCase.id}</h5>
                </td>
                <td
                  className="border-b border-[#eee] py-5 px-4 underline dark:border-strokedark cursor-pointer font-medium text-primary hover:underline"
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

      {/* Tooltip */}
      {tooltipVisible && tooltipContent && (
        <div
          className="absolute bg-black text-white text-sm rounded p-2 dark:bg-slate-500 dark:border-strokedark"
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
            <p>{modalContent.description}</p>
            <p><strong>Status:</strong> {modalContent.status}</p>
            <p><strong>Time Taken:</strong> {modalContent.timeTaken} seconds</p>
            {modalContent.errorMessage && (
              <p><strong>Error Message:</strong> {modalContent.errorMessage}</p>
            )}
            <button className="mt-2 bg-primary text-white rounded px-4 py-2 hover:bg-secondary" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestCaseTable;
