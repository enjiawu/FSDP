import React, { useState } from "react";
import { useParams } from "react-router-dom";
import AllTestCasesTable from "../components/Tables/AllTestCasesTable";

interface AllApplicationResult {
  id: number;
  title: string;
  totalTestCases: number;
  successRate: number;
}

const allApplicationTable: AllApplicationResult[] = [
  {
    id: 1,
    title: 'Banking Application 1',
    totalTestCases: 14,
    successRate: 79,
  },
  {
    id: 2,
    title: 'Banking Application 2',
    totalTestCases: 8,
    successRate: 88,
  },
  {
    id: 3,
    title: 'Wallet App 1',
    totalTestCases: 7,
    successRate: 86,
  },
  {
    id: 4,
    title: 'Wallet App 2',
    totalTestCases: 6,
    successRate: 67,
  },
];

const ApplicationDetailPage: React.FC = () => {
  const { id } = useParams();
  const application = allApplicationTable.find((app) => app.id === parseInt(id || ''));

  if (!application) {
    return <div>Application not found</div>;
  }

  // Manage the state for maxTable in this page
  const [maxTable, setMaxTable] = useState<number | null>(5);

  return (
    <div className="p-4">
      <h1>{application.title}</h1>
      <p><strong>ID:</strong> {application.id}</p>
      <p><strong>Total Test Cases:</strong> {application.totalTestCases}</p>
      <p><strong>Success Rate:</strong> {application.successRate}%</p>

      {/* Pass maxTable as a prop to AllTestCasesTable */}
      <AllTestCasesTable maxTable={maxTable} />
      
      {/* Buttons to modify maxTable */}
      <div>
        <button onClick={() => setMaxTable(5)}>Show 5 rows</button>
        <button onClick={() => setMaxTable(10)}>Show 10 rows</button>
        <button onClick={() => setMaxTable(null)}>Show All</button>
      </div>
    </div>
  );
};

export default ApplicationDetailPage;
