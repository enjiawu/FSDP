import React, { useState, useEffect} from 'react';
import HistoryTable from '../components/Tables/HistoryTableByApplication';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';

const AllHistory: React.FC = () => {
    const [userRole, setUserRole] = useState<string | null>(null);
    const [assignedApps, setAssignedApps] = useState<string[]>([]);
    useEffect(() => {
        const fetchUserDetails = async () => {
        try {
            const token = localStorage.getItem('token'); // Retrieve the token from localStorage
            const decodedToken = token
            ? JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
            : null;
            const role = decodedToken?.role; // Assuming the role is included in the token
            setUserRole(role);

            const username = decodedToken?.username;

            if (username) {
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

            const data = await response.json();
            setAssignedApps(data);
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
        };

        fetchUserDetails();
    }, []);

    // Show loading state if userRole or assignedApps are still being fetched
    if (userRole === null || (userRole === null && assignedApps.length === 0)) {
        return <div className="text-center mt-10 text-lg font-semibold">You are currently accessing this platform as a restricted user. If you are assigned to any application that you are managing, please contact OCBC Helpdesk for further assistance.</div>;
    }
  return (
    <>
      <Breadcrumb pageName = "All History"/>
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <h2 className="text-xl font-semibold mb-4">History</h2>
        <HistoryTable/>
      </div>
    </>
  );
};

export default AllHistory;
