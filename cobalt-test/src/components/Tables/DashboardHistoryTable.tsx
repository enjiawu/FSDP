import React from 'react';
import { FaChevronDown, FaEye, FaRedoAlt } from 'react-icons/fa';

// Define the interface for a test case result
interface TestCaseResult {
  id: number;
  browser: string;
  timeTaken: string;
  name: string;
  description: string;
  status: 'Passed' | 'Failed' | 'Pending'; // Added status for each test case
}

// Define the interface for an application result, including test cases
interface ApplicationResult {
  id: number;
  title: string;
  dateTime: string;
  status: 'Passed' | 'Failed' | 'Pending';
  testCases: TestCaseResult[]; // Array of test cases for each application result
}

const applicationResults: ApplicationResult[] = [
  {
    id: 1,
    title: 'Banking Application',
    dateTime: 'Jan 13, 2024 10:00 AM',
    status: 'Passed',
    testCases: [
      { id: 1, browser: 'Chrome', timeTaken: '2s', name: 'Login Test', status: 'Passed', description: 'Test user login to check secure login functionality.' },
      { id: 2, browser: 'Firefox', timeTaken: '3s', name: 'Transaction Test', status: 'Passed', description: 'Test bank transfer feature ensuring correct amount transfer.' },
    ],
  },
  {
    id: 2,
    title: 'Banking Application',
    dateTime: 'Jan 14, 2024 11:30 AM',
    status: 'Failed',
    testCases: [
      { id: 3, browser: 'Chrome', timeTaken: '5s', name: 'Signup Test', status: 'Failed', description: 'Test user signup. Ensure that the signup process works correctly and collects all necessary information.' },
      { id: 4, browser: 'Safari', timeTaken: '4s', name: 'Search Test', status: 'Passed', description: 'Test search functionality. Ensure that search bar returns accurate results within seconds.' },
    ],
  },
  {
    id: 3,
    title: 'Banking Application',
    dateTime: 'Jan 15, 2024 02:15 PM',
    status: 'Passed',
    testCases: [
      { id: 5, browser: 'Chrome', timeTaken: '3s', name: 'Login Test', status: 'Passed', description: 'Test user login with multiple scenarios, including password reset and error handling.' },
      { id: 6, browser: 'Firefox', timeTaken: '6s', name: 'Checkout Test', status: 'Failed', description: 'Test checkout process to simulate purchase flow from adding items to completing the checkout.' },
    ],
  },
];

const DashboardHistoryTable = () => {
  const [openDropdown, setOpenDropdown] = React.useState<number | null>(null);

  const toggleDropdown = (id: number) => {
    setOpenDropdown((prev) => (prev === id ? null : id));
  };

  const getPassFailCounts = (testCases: TestCaseResult[]) => {
    const passed = testCases.filter((testCase) => testCase.status === 'Passed').length;
    const failed = testCases.filter((testCase) => testCase.status === 'Failed').length;
    return { passed, failed };
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h2 className="text-xl font-semibold mb-4">History</h2>
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[50px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">ID</th>
              <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white">Date/Time</th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">Status</th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">Passed</th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">Failed</th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applicationResults.map((result) => {
              const { passed, failed } = getPassFailCounts(result.testCases);
              const overallStatus = failed > 0 ? 'Failed' : 'Passed';
              return (
                <tr key={result.id} className="border-b border-stroke dark:border-strokedark hover:bg-gray-2 dark:hover:bg-meta-4">
                  <td className="py-4 px-4 text-black dark:text-white">{result.id}</td>
                  <td className="py-4 px-4 text-black dark:text-white">{result.dateTime}</td>
                  <td className="py-4 px-4 text-black dark:text-white text-center">
                    <div
                      className={`inline-block px-4 py-1 rounded-full text-sm font-medium ${overallStatus === 'Passed' ? 'bg-green-200 text-green-600' : 'bg-red-200 text-red-600'}`}
                    >
                      {overallStatus}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-black dark:text-white">{passed}</td>
                  <td className="py-4 px-4 text-black dark:text-white">{failed}</td>
                  <td className="py-4 px-4 text-black dark:text-white">
                    <div className="flex space-x-2">
                      {failed > 0 && (
                        <>
                          <button className="flex items-center text-gray-600">
                            <FaEye />
                          </button>
                          <button className="flex items-center text-gray-600">
                            <FaRedoAlt />
                          </button>
                          <button
                            onClick={() => toggleDropdown(result.id)}
                            className="flex items-center text-gray-600"
                          >
                            <FaChevronDown />
                          </button>
                        </>
                      )}
                    </div>
                    {openDropdown === result.id && (
                      <div className="ml-4 mt-2 text-sm text-gray-600 w-full">
                        <h3 className="font-semibold">Failed Test Cases</h3>
                        <table className="mt-2 w-full table-auto">
                          <thead>
                            <tr className="bg-gray-100 dark:bg-meta-4">
                              <th className="py-2 px-4 text-left text-black dark:text-white">Test Case ID</th>
                              <th className="py-2 px-4 text-left text-black dark:text-white">Name</th>
                              <th className="py-2 px-4 text-left text-black dark:text-white">Time Taken</th>
                              <th className="py-2 px-4 text-left text-black dark:text-white">Description</th>
                              <th className="py-2 px-4 text-left text-black dark:text-white">Browser</th>
                            </tr>
                          </thead>
                          <tbody>
                            {result.testCases
                              .filter((testCase) => testCase.status === 'Failed')
                              .map((testCase) => (
                                <tr key={testCase.id} className="border-b border-stroke dark:border-strokedark hover:bg-gray-2 dark:hover:bg-meta-4">
                                  <td className="py-2 px-4 text-black dark:text-white">{testCase.id}</td>
                                  <td className="py-2 px-4 text-black dark:text-white">{testCase.name}</td>
                                  <td className="py-2 px-4 text-black dark:text-white">{testCase.timeTaken}</td>
                                  <td className="py-2 px-4 text-black dark:text-white">
                                    <div className="tooltip" title={testCase.description}>
                                      {testCase.description.length > 20 ? `${testCase.description.slice(0, 20)}...` : testCase.description}
                                    </div>
                                  </td>
                                  <td className="py-2 px-4 text-black dark:text-white">{testCase.browser}</td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardHistoryTable;
