import React, { useState } from 'react';
import '../../css/general.css';
import DropdownSortBy from '../Dropdowns/DropdownSortBy';

// Define the interface for a test case
interface TestCase {
  id: number;
  title: string;
  description: string;
  timeTaken: number; // Time taken in seconds
  successRate: number; // Success rate as a percentage
  dateAdded: string; // Date added in ISO format or any preferred format
  reporter: string; // Reporter name
}

const testCases: TestCase[] = [
  { id: 1, title: 'Login Functionality Test', description: 'This test verifies that the login functionality works as expected.', timeTaken: 120, successRate: 100, dateAdded: '2024-10-01', reporter: 'Alice Johnson' },
  { id: 2, title: 'Sign Up Functionality Test', description: 'This test checks if new users can sign up successfully and receive confirmation.', timeTaken: 150, successRate: 0, dateAdded: '2024-10-02', reporter: 'Bob Smith' },
  { id: 3, title: 'Profile Update Test', description: 'Verifies that users can update their profile information successfully.', timeTaken: 80, successRate: 100, dateAdded: '2024-10-03', reporter: 'Charlie Brown' },
  { id: 4, title: 'Password Reset Test', description: 'Checks if users can reset their password via email.', timeTaken: 90, successRate: 80, dateAdded: '2024-10-04', reporter: 'David Wilson' },
  { id: 5, title: 'Dashboard Load Test', description: 'Ensures that the user dashboard loads within acceptable time limits.', timeTaken: 200, successRate: 95, dateAdded: '2024-10-05', reporter: 'Eva Green' },
  { id: 6, title: 'Search Functionality Test', description: 'Tests if the search feature returns accurate results.', timeTaken: 110, successRate: 85, dateAdded: '2024-10-06', reporter: 'Frank White' },
  { id: 7, title: 'Logout Functionality Test', description: 'Verifies that users can log out successfully from their accounts.', timeTaken: 60, successRate: 100, dateAdded: '2024-10-07', reporter: 'Grace Lee' },
  { id: 8, title: 'Email Notifications Test', description: 'Checks if users receive email notifications for key events.', timeTaken: 130, successRate: 90, dateAdded: '2024-10-08', reporter: 'Henry Adams' },
  { id: 9, title: 'Mobile Responsiveness Test', description: 'Tests if the website is responsive on mobile devices.', timeTaken: 140, successRate: 95, dateAdded: '2024-10-09', reporter: 'Ivy Carter' },
  { id: 10, title: 'User Profile Picture Upload Test', description: 'Checks if users can upload and update their profile pictures.', timeTaken: 50, successRate: 100, dateAdded: '2024-10-10', reporter: 'Jack Brown' },
  { id: 11, title: 'Checkout Process Test', description: 'Ensures that users can complete the checkout process.', timeTaken: 200, successRate: 100, dateAdded: '2024-10-11', reporter: 'Henry Taylor' },
  { id: 12, title: 'Payment Method Test', description: 'Verifies that users can add and remove payment methods successfully.', timeTaken: 170, successRate: 80, dateAdded: '2024-10-12', reporter: 'Laura Wilson' },
  { id: 13, title: 'Product Review Submission Test', description: 'Checks if users can submit product reviews successfully.', timeTaken: 90, successRate: 85, dateAdded: '2024-10-13', reporter: 'Michael Johnson' },
  { id: 14, title: 'Wishlist Functionality Test', description: 'Tests if users can add and remove items from their wishlist.', timeTaken: 100, successRate: 90, dateAdded: '2024-10-14', reporter: 'Nina Edwards' },
  { id: 15, title: 'Session Timeout Test', description: 'Verifies that sessions time out after a specified duration.', timeTaken: 60, successRate: 100, dateAdded: '2024-10-15', reporter: 'Oliver Gray' },
  { id: 16, title: 'User Feedback Submission Test', description: 'Checks if users can submit feedback about their experience.', timeTaken: 80, successRate: 95, dateAdded: '2024-10-16', reporter: 'Pamela Moore' },
  { id: 17, title: 'Multi-language Support Test', description: 'Tests if the website supports multiple languages correctly.', timeTaken: 120, successRate: 90, dateAdded: '2024-10-17', reporter: 'Quinn Taylor' },
  { id: 18, title: 'Security Vulnerability Test', description: 'Checks for common security vulnerabilities in the application.', timeTaken: 150, successRate: 70, dateAdded: '2024-10-18', reporter: 'Ryan Lewis' },
  { id: 19, title: 'API Response Time Test', description: 'Ensures that the API responds within acceptable time limits.', timeTaken: 200, successRate: 85, dateAdded: '2024-10-19', reporter: 'Sophia Walker' },
  { id: 20, title: 'Accessibility Compliance Test', description: 'Verifies that the application meets accessibility standards.', timeTaken: 180, successRate: 75, dateAdded: '2024-10-20', reporter: 'Tom Scott' },
];

const AllTestCasesTable = () => {
  const [modalContent, setModalContent] = useState<{ title: string; description: string; timeTaken: number } | null>(null);
  const [tooltipContent, setTooltipContent] = useState<string | null>(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'id-asc' | 'id-desc' | 'title-asc' | 'title-desc' | 'successRate-asc' | 'successRate-desc' | 'dateAdded-asc' | 'dateAdded-desc' | 'reporter-asc' | 'reporter-desc'>('id-asc');

  const filteredTestCases = testCases.filter(testCase =>
    testCase.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedTestCases = filteredTestCases.sort((a, b) => {
    switch (filter) {
      case 'id-asc':
        return a.id - b.id;
      case 'id-desc':
        return b.id - a.id;
      case 'title-asc':
        return a.title.localeCompare(b.title);
      case 'title-desc':
        return b.title.localeCompare(a.title);
      case 'successRate-asc':
        return a.successRate - b.successRate;
      case 'successRate-desc':
        return b.successRate - a.successRate;
      case 'dateAdded-asc':
        return new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime();
      case 'dateAdded-desc':
        return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      case 'reporter-asc':
        return a.reporter.localeCompare(b.reporter);
      case 'reporter-desc':
        return b.reporter.localeCompare(a.reporter);
      default:
        return 0;
    }
  });

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
        <h2 className="text-xl font-semibold text-black dark:text-white">All Test Cases</h2>
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
              onChange={(value) => setFilter(value as 'id-asc' | 'id-desc' | 'title-asc' | 'title-desc' | 'successRate-asc' | 'successRate-desc' | 'dateAdded-asc' | 'dateAdded-desc' | 'reporter-asc' | 'reporter-desc')}
              options={[
                { label: 'ID (asc)', value: 'id-asc' },
                { label: 'ID (desc)', value: 'id-desc' },
                { label: 'Title (asc)', value: 'title-asc' },
                { label: 'Title (desc)', value: 'title-desc' },
                { label: 'Success Rate (asc)', value: 'successRate-asc' },
                { label: 'Success Rate (desc)', value: 'successRate-desc' },
                { label: 'Date Added (asc)', value: 'dateAdded-asc' },
                { label: 'Date Added (desc)', value: 'dateAdded-desc' },
                { label: 'Reporter (asc)', value: 'reporter-asc' },
                { label: 'Reporter (desc)', value: 'reporter-desc' },
              ]}
            />
          </div>
      </div>

      <div className="max-w-full overflow-x-auto h-100">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[50px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">ID</th>
              <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white">Test Case</th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">Description</th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">Time Taken (s)</th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">Success Rate (%)</th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">Date Added</th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">Reporter</th>
              <th className="min-w-[50px] py-4 px-4 font-medium text-black dark:text-white">Edit</th>
            </tr>
          </thead>
          <tbody>
            {filteredTestCases.map((testCase) => (
              <tr key={testCase.id}>
                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">{testCase.id}</h5>
                </td>
                <td
                  className="border-b border-[#eee] py-5 px-4 dark:border-strokedark cursor-pointer font-medium text-primary hover:underline"
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
                  <p className="text-black dark:text-white">{testCase.successRate}</p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">{testCase.dateAdded}</p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">{testCase.reporter}</p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // TODO: edit action here
                    }}
                    className="text-gray-500 hover:text-gray-700"
                    aria-label="Edit"
                  >
                    &#x22EE; 
                  </button>
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
    </div>
  );
};

export default AllTestCasesTable; 
