import React, { useState } from 'react';
import HistoryByTestCaseTable from '../../components/Tables/HistoryTableByTestCase';
import HistoryByApplicationTable from '../../components/Tables/HistoryTableByApplication';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useParams } from 'react-router-dom';
import PageTitle from '../../components/PageTitle';

const DashboardHistory: React.FC = () => {
  const [viewBy, setViewBy] = useState<'application' | 'testcase'>('application');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleToggle = () => {
    setViewBy((prev) => (prev === 'application' ? 'testcase' : 'application'));
  };

  const handleGenerateReport = async () => {
    setLoading(true);
    setAiResponse(null); // Clear previous response
    try {
      // Call generateReport.js via the backend
      const response = await fetch('http://localhost:3000/generateReport', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setAiResponse(data.report || 'No response from AI.');
    } catch (error) {
      console.error('Error calling generateReport.js:', error);
      setAiResponse('Error generating report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const { appTitle } = useParams();
  const decodedAppTitle = decodeURIComponent(appTitle || '');

  return (
    <>
      <PageTitle title={`${decodedAppTitle} | Dashboard History | CobaltTest - OCBC Automated Testing`} />
      <Breadcrumb pageName={decodedAppTitle} />
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">History</h2>
          <label className="flex items-center cursor-pointer">
            <span className="mr-2">By Application</span>
            <div className="relative">
              <input type="checkbox" className="sr-only" checked={viewBy === 'testcase'} onChange={handleToggle} />
              <div className="block bg-gray-600 w-14 h-8 rounded-full transition-all duration-300"></div>
              <div
                className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 ${
                  viewBy === 'testcase' ? 'transform translate-x-6' : ''
                }`}
              ></div>
            </div>
            <span className="ml-2">By Test Case</span>
          </label>
        </div>
        <div className="transition-opacity duration-300">
          {viewBy === 'application' ? <HistoryByApplicationTable /> : <HistoryByTestCaseTable />}
        </div>
        <div className="mt-6">
          <button
            onClick={handleGenerateReport}
            className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600 transition-all"
            disabled={loading}
          >
            {loading ? 'Generating Report...' : 'Generate Report'}
          </button>
        </div>
        {aiResponse && (
          <div className="mt-4 p-3 border rounded-lg bg-gray-100 dark:bg-gray-800"
          style={{
            overflowY: 'auto',  // Add scroll if content exceeds max height
            whiteSpace: 'pre-wrap', // Preserve formatting and wrap text
            wordWrap: 'break-word', // Ensure long words don't overflow
          }}>
            <h3 className="font-semibold">AI Response:</h3>
            <pre className="text-sm text-gray-600 dark:text-gray-300">{aiResponse}</pre>
          </div>
        )}
      </div>
    </>
  );
};

export default DashboardHistory;
