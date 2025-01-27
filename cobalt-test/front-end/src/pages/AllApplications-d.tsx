import React, { useState, useEffect } from 'react';
import AllApplicationTable from '../components/Tables/AllApplicationTable';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';


const AllApplication: React.FC = () => {
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
    if (userRole === null || assignedApps.length === 0) {
        return <div className="text-center mt-10 text-lg font-semibold">You are currently accessing this platform as a restricted user. If you are assigned to any application that you are managing, please contact OCBC Helpdesk for further assistance.</div>;
    }
  return (
    <>
      <Breadcrumb pageName = "All Applications"/>
      <AllApplicationTable />
    </>
  );
};

export default AllApplication;
