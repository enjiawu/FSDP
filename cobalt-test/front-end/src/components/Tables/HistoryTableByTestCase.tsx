import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronDown} from 'react-icons/fa';

interface TestCase {
  id: number;
  name: string;
  browser: string;
  description: string;
  history: { dateTime: string; timeTaken: string; status: 'Passed' | 'Failed' | 'Pending'; }[];
  successRate?: string;
}

const testCases: TestCase[] = [
  {
    id: 1,
    name: "Login Test",
    description: "Tests user login functionality",
    browser: "Chrome",
    history: [
      { dateTime: "2024-10-30 10:00 AM", timeTaken: "12s", status: "Passed" },
      { dateTime: "2024-10-31 09:30 AM", timeTaken: "13s", status: "Failed" },
      { dateTime: "2024-10-31 10:15 AM", timeTaken: "11s", status: "Passed" }
    ],
  },
  {
    id: 2,
    name: "Password Reset",
    description: "Checks password reset flow",
    browser: "Firefox",
    history: [
      { dateTime: "2024-10-30 10:20 AM", timeTaken: "10s", status: "Failed" },
      { dateTime: "2024-10-31 10:25 AM", timeTaken: "12s", status: "Passed" }
    ],
  },
  {
    id: 3,
    name: "Session Timeout",
    description: "Validates session timeout",
    browser: "Safari",
    history: [
      { dateTime: "2024-10-30 10:30 AM", timeTaken: "10s", status: "Failed" },
      { dateTime: "2024-10-31 10:35 AM", timeTaken: "11s", status: "Passed" }
    ],
  }
];

// Function to calculate success rate for each test case and add it to the object
testCases.forEach(testCase => {
  const passedCount = testCase.history.filter(run => run.status === "Passed").length;
  const successRate = ((passedCount / testCase.history.length) * 100).toFixed(2);
  testCase.successRate = `${successRate}%`;
});

const HistoryTableByTestCase = () => {
  const [openDropdown, setOpenDropdown] = React.useState<number | null>(null);
  const [tooltipContent, setTooltipContent] = useState<string | null>(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const navigate = useNavigate();

  const toggleDropdown = (id: number) => {
    setOpenDropdown((prev) => (prev === id ? null : id));
  };

  const goToDashboard = (applicationName: string, id: number) => {
    navigate(`/dashboards/${applicationName}/${id}`);
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
    <div>
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="py-4 px-4 font-medium text-black dark:text-white">ID</th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">Name</th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">Browser</th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">Description</th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">Success Rate</th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">See More</th>
            </tr>
          </thead>
          <tbody>
            {testCases.map((result) => {
              return (
                <>
                  <tr
                    key={result.id}
                    className="border-b border-stroke dark:border-strokedark hover:bg-gray-2 dark:hover:bg-meta-4"
                  >
                    <td className="py-4 px-4 text-black dark:text-white">{result.id}</td>
                    <td className="py-4 px-4 text-black dark:text-white">{result.name}</td>
                    <td className="py-4 px-4 text-black dark:text-white">{result.browser}</td>
                    <td
                      className="border-b border-[#eee] py-2 px-4 dark:border-strokedark cursor-pointer dark:text-white"
                      onMouseEnter={(e) => showTooltip(e, result.description)}
                      onMouseLeave={hideTooltip}
                    >
                      <div className="max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
                        {result.description.length > 50
                          ? `${result.description.substring(0, 50)}...`
                          : result.description}
                      </div>
                    </td>
                    <td className="py-4 px-4">{result.successRate}</td>
                    <td className="py-4 px-4 text-black dark:text-white">
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDropdown(result.id);
                          }}
                          className="flex items-center text-gray-600 dark:text-white"
                        >
                          <FaChevronDown />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Render the expanded row here */}
                  {openDropdown === result.id && (
                    <tr>
                      <td colSpan={6} className="py-2 px-4 w-full">
                        <div className="text-sm text-gray-600">
                          <h3 className="font-semibold dark:text-white">Failed Test Cases</h3>
                          <table className="mt-2 w-full table-auto">
                            <thead>
                              <tr className="bg-gray-100 dark:bg-meta-4">
                                <th className="py-2 px-4 text-left text-black dark:text-white">Date/Time</th>
                                <th className="py-2 px-4 text-left text-black dark:text-white">Time Taken (s)</th>
                                <th className="py-2 px-4 text-left text-black dark:text-white">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {result.history
                                .filter((testCase) => testCase.status === 'Failed')
                                .map((testCase) => (
                                  <tr key={testCase.dateTime}>
                                    <td className="py-2 px-4 dark:text-white">{testCase.dateTime}</td>
                                    <td className="py-2 px-4 dark:text-white">{testCase.timeTaken}</td>
                                    <td className="py-4 px-4">
                                      <div
                                        className={`inline-block px-4 py-1 rounded-full text-sm font-medium ${testCase.status === 'Passed' ? 'bg-green-200 text-green-600' : 'bg-red-200 text-red-600'}`}
                                      >
                                        {testCase.status}
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
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

export default HistoryTableByTestCase;
