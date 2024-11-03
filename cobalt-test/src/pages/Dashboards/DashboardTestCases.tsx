import React from 'react';

import AllTestCasesTable from '../../components/Tables/AllTestCasesTable';

const Dashboard: React.FC = () => {
  return (
    <>
    {/* Test Application Card */}
    <div className="p-4 border rounded-lg shadow-sm bg-white dark:border-strokedark dark:bg-boxdark ">
        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">Test Application</h3>
        <button className="bg-primary text-white px-4 py-2 w-full rounded hover:bg-secondary">Run Test</button>
    </div>

    <div className = "mt-5">
        <AllTestCasesTable />
    </div>
    </>
  );
};

export default Dashboard;
