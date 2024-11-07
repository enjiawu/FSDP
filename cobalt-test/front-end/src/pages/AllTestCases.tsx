import React from 'react';

import AllTestCasesTable from '../components/Tables/AllTestCasesTable';
import UploadCard from '../components/UploadCard';

const Dashboard: React.FC = () => {
  return (
    <>
    {/* Test Application Card */}
   <UploadCard />

    <div className = "mt-5">
        <AllTestCasesTable />
    </div>
    </>
  );
};

export default Dashboard;
