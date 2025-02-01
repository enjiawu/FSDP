import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface AllApplicationResult {
  id: number;
  title: string;
  totalTestCases: number;
  successRate: number;
}

const allApplicationTable: AllApplicationResult[] = [
  {
    id: 1,
    title: 'Application 1',
    totalTestCases: 9,
    successRate: 98,
  },
  {
    id: 2,
    title: 'Application 2',
    totalTestCases: 8,
    successRate: 90,
  },
];


const AllApplicationTable: React.FC = () => {
    const [assignedApps, setAssignedApps] = useState<string[]>([]);
    const [userRole, setUserRole] = useState<string | null>(null);
    useEffect(() => {
        const fetchAssignedApps = async () => {
        try {
            const token = localStorage.getItem('token'); // Retrieve the token from localStorage
            const decodedToken = token
            ? JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
            : null;
            const username = decodedToken?.username;
            const role = decodedToken?.role;
            setUserRole(role);

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

            const data = await response.json(); // Assuming the response is an array of application names
            setAssignedApps(data);
        } catch (error) {
            console.error('Error fetching assigned apps:', error);
        }
        };

        fetchAssignedApps();
    }, []);

   // Filter applications based on assigned apps
   const filteredApplications = userRole === 'admin' 
   ? allApplicationTable 
   : allApplicationTable.filter(app => assignedApps.includes(app.title));

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[50px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">ID</th>
              <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white">Application</th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">Total Test Cases</th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">Success Rate (%)</th>
            </tr>
          </thead>
          <tbody>
            {filteredApplications.map((application) => (
              <tr key={application.id}>
                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">{application.id}</h5>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <Link
                    to={`/all-applications/${application.id}`}
                    className="font-medium text-red-500 hover:underline"
                  >
                    {application.title}
                  </Link>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">{application.totalTestCases}</p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <div className="w-full bg-gray-200 rounded-md h-4 flex dark:bg-gray-700">
                    <div
                      className="h-4 bg-green-500 rounded-l-md"
                      style={{ width: `${application.successRate}%` }}
                    ></div>
                    <div
                      className="h-4 bg-red-500 rounded-r-md"
                      style={{ width: `${100 - application.successRate}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-medium text-black dark:text-white ml-2">
                    {application.successRate}% Success
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllApplicationTable;
