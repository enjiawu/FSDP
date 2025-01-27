import React, { useState, useEffect } from 'react';
import CardDataStats from '../../components/Cards/CardDataStats';
import OverallBrowserStatus from '../../components/Charts/OverallBrowserStatus-d';
import OverallTestCaseStatus from '../../components/Charts/OverallTestCaseStatus-d';
import TestCaseTable from '../../components/Tables/TestCaseTable-d';
import { runTestRequest } from '../../../../back-end/runTestRequest';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useParams } from 'react-router-dom';
import PageTitle from '../../components/PageTitle';

const Dashboard: React.FC = () => {
  const { appTitle } = useParams();
  const decodedAppTitle = decodeURIComponent(appTitle || '');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState<any[]>([]); // to store the list of users
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newUser, setNewUser] = useState(''); // Input for new user assignment

  // Dashboard Statistics
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [remainingTests, setRemainingTests] = useState(0);
  const [averageTime, setAverageTime] = useState(0);

  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const token = localStorage.getItem('token');

  // Decode JWT manually to extract role
  const getUserRole = () => {
    if (token) {
      try {
        const tokenParts = token.split('.');  // Split JWT into header, payload, and signature
        if (tokenParts.length !== 3) throw new Error('Invalid token');

        const payload = tokenParts[1];  // The second part is the payload
        const decodedPayload = JSON.parse(atob(payload));  // Base64 decode and parse the payload
        return decodedPayload?.role;  // Return the role from the payload
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    }
    return null;
  };

  // Add user to the application
  const handleAssignUser = async () => {
    if (!newUser) {
      setError('Please provide a username.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/assign-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: newUser,
          applicationName: decodedAppTitle,
        }),
      });

      const data = await response.json();

      if (response.status === 200) {
        setError('');
        setNewUser('');
        fetchUsers(); // Re-fetch users after successfully assigning
      } else {
        setError(data.message || 'Error assigning user.');
      }
    } catch (error) {
      console.error(error);
      setError('Server error while assigning user.');
    }
  };

  // Delete user from the application
  const handleDeleteUser = async (username: string) => {
    try {
      const response = await fetch('http://localhost:3000/delete-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username,
          applicationName: decodedAppTitle,
        }),
      });

      const data = await response.json();

      if (response.status === 200) {
        setError('');
        fetchUsers(); // Re-fetch users after successfully deleting
      } else {
        setError(data.message || 'Error deleting user.');
      }
    } catch (error) {
      console.error(error);
      setError('Server error while deleting user.');
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/assigned/${decodedAppTitle}`,
      );
      if (response.status === 404) {
        // Handle 404 response: no users found
        setUsers([]); // Set an empty list of users
        setError('No users found'); // Display a specific message
        setLoading(false);
      } else if (response.ok) {
        const data = await response.json();
        setUsers(data.users); // Assuming response contains the list of users
        setError('');
        setLoading(false);
      } else {
        setError('Failed to load users');
      }
    } catch (err) {
      setError('Error occurred while fetching users');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      // Fetch users from the backend when the modal is opened
      fetchUsers();
    }
  }, [isModalOpen, decodedAppTitle]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:3000/get-stats'); // Update with your backend API URL
        const data = await response.json();
        setEstimatedTime(
          Number(((data.average * data.remaining) / 60).toFixed(2)),
        );
        setRemainingTests(data.remaining);
        setAverageTime(data.average);
      } catch (error) {
        console.error('Error fetching statistics: ', error);
      }
    };

    fetchStats();

    const socket = new WebSocket('ws://localhost:8080');

    socket.onopen = () => {
      console.log('Connected to WebSocket server');
      socket.send('test');
      // console.log('TEST');
    };

    socket.onmessage = (event) => {
      const remaining = JSON.parse(event.data).remaining;
      if (remaining !== undefined) {
        setRemainingTests(remaining);
      }

      const average = JSON.parse(event.data).average;
      if (average !== undefined) {
        setAverageTime(average);
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket Error: ', error);
    };

    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    setEstimatedTime(Number(((averageTime * remainingTests) / 60).toFixed(2)));
  }, [averageTime, remainingTests]);

  return (
    <>
      <PageTitle
        title={`${decodedAppTitle} | Dashboard | CobaltTest - OCBC Automated Testing`}
      />
      {/* Breadcrumb */}
      <Breadcrumb pageName={decodedAppTitle} />
      <button
        className="bg-primary text-white px-4 py-2 rounded hover:bg-secondary mb-5"
        onClick={toggleModal}
      >
        View Application Users
      </button>

      {/* Modal for Users */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-xl font-bold mb-4">Application Users</h3>

            {/* Loading or error handling */}
            {loading ? (
              <div>Loading users...</div>
            ) : error ? (
              <div>{error}</div>
            ) : (
              <ul>
                {users.length > 0 ? (
                  users.map((user) => (
                    <li
                      key={user.username}
                      className="flex justify-between items-center"
                    >
                      <span>{user.username}</span>
                      {user.role === 'admin' || user.role === 'app_owner' ? (
                        <span className="text-green-500">
                          {user.role === 'admin' ? 'Admin' : 'App Owner'}
                        </span>
                      ) : (
                        // Conditional rendering for the "Remove User" button
                        getUserRole() !== 'app_user' && getUserRole () !== null ? (
                          <button
                            onClick={() => handleDeleteUser(user.username)}
                            className="bg-red-500 text-white px-2 py-1 mb-1 rounded hover:bg-red-700"
                          >
                            Remove User
                          </button>
                        ) : (
                          // Optionally, hide the button if the user is an app_user
                          <span></span>
                        )
                      )}     
                    </li>
                  ))
                ) : (
                  <div>No users found</div>
                )}
              </ul>
            )}
            <div>
              <input
                type="text"
                value={newUser}
                onChange={(e) => setNewUser(e.target.value)}
                placeholder="Enter username to assign"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-5"
              />
              {getUserRole() !== 'app_user' && getUserRole() !== null && (
                <button
                onClick={handleAssignUser}
                className="bg-green-500 text-white px-4 py-2 rounded-md mt-2 hover:bg-green-700"
              >
                Assign User
              </button>
              )}
            </div>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded mt-4 hover:bg-red-700"
              onClick={toggleModal}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:gap-6 xl:gap-7.5">
        {/* Test Application Card */}
        <div className="col-span-1 md:col-span-1 xl:col-span-1 p-4 border rounded-lg shadow-lg bg-white dark:border-strokedark dark:bg-boxdark ">
          <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">
            Test Application
          </h3>
          <button
            className="bg-primary text-white px-4 py-2 w-full rounded hover:bg-secondary"
            onClick={runTestRequest}
          >
            Run Test
          </button>
        </div>

        {/* Testing Schedule Card */}
        <div className="col-span-1 md:col-span-3 xl:col-span-3 p-4 border rounded-lg shadow-lg bg-white dark:border-strokedark dark:bg-boxdark ">
          <div className="flex items-center">
            <svg
              className="h-6 w-6 text-gray-500 dark:text-gray-400 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Testing Schedule
            </h4>
          </div>
          <div className="mt-2">
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Automated tests run nightly at midnight</strong> to ensure
              software integrity. This identifies regressions and helps maintain
              a stable build. Results allow the team to address issues promptly,
              ensuring a smoother user experience and minimizing disruptions.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-4">
        {/* Table for Test Results */}
        <div className="col-span-1 md:col-span-3">
          <TestCaseTable />
        </div>

        {/* Stats Cards on the Right */}
        <div className="col-span-1 md:col-span-1 flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4">
            <CardDataStats
              title="Estimated time until completion (in min)"
              total={estimatedTime}
            >
              <svg
                className="fill-primary dark:fill-white"
                width="20"
                height="22"
                viewBox="0 0 102.85 122.88"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M35.69,101.21a24.08,24.08,0,0,0-4.23-11.35c-2.27-3.17-5.22-5.33-8.32-5.33s-6.06,2.16-8.33,5.33a24.08,24.08,0,0,0-4.23,11.35Zm78.39-73.63a4.17,4.17,0,0,0-7.37,3.81,4.68,4.68,0,0,0,.37.7,44,44,0,0,1,3.6,6.74,4.17,4.17,0,0,0,7.94-2.29,4.32,4.32,0,0,0-.3-1,52.05,52.05,0,0,0-4.24-7.93ZM107.14,16.5a4.63,4.63,0,0,1-3.23,5.18L91.54,25.46a4.63,4.63,0,1,1-2.69-8.86L90,16.24A47,47,0,0,0,22.46,44.49H13.84A55.33,55.33,0,0,1,94.7,9.33l-1.16-3A4.64,4.64,0,1,1,102.22,3l4.62,12.09a4.81,4.81,0,0,1,.3,1.42ZM67.6,104.55a53.52,53.52,0,0,0,9.43-.87,4.17,4.17,0,0,1,1,8.25,61.44,61.44,0,0,1-7.38.94c-1.31.06-3,0-4.34,0a55.19,55.19,0,0,1-10.91-1.33V103a46.85,46.85,0,0,0,12.15,1.59Zm23.25-6a4.17,4.17,0,1,0,4.09,7.26,55.27,55.27,0,0,0,7.46-5.06,4.17,4.17,0,0,0-3.89-7.21,4.07,4.07,0,0,0-1.34.73,47.39,47.39,0,0,1-6.32,4.28Zm16.42-15.64a4.16,4.16,0,1,0,7.06,4.41,55.51,55.51,0,0,0,4.15-8,4.17,4.17,0,0,0-7.15-4.14,4.11,4.11,0,0,0-.54.93,46,46,0,0,1-3.52,6.79Zm7.13-21.62a4.17,4.17,0,0,0,8.16,1.46,3.91,3.91,0,0,0,.15-.83,56.09,56.09,0,0,0,0-9,4.16,4.16,0,1,0-8.3.69,47.78,47.78,0,0,1,0,7.66ZM59.12,35a4.29,4.29,0,0,1,8.57,0V61.09l17.84,7.85a4.28,4.28,0,1,1-3.44,7.83L61.91,67.9a4.29,4.29,0,0,1-2.79-4V35ZM12.59,70.51h21.1a20.92,20.92,0,0,0,2-7H10.56a20.7,20.7,0,0,0,2,7ZM2.47,105.83a2.09,2.09,0,1,1,0-4.1H5.55a28.67,28.67,0,0,1,5.13-14.44,19.38,19.38,0,0,1,6.1-5.67,18.41,18.41,0,0,1-6.17-5.21,24.83,24.83,0,0,1-5.07-14H2.61a2.09,2.09,0,1,1,0-4.1H43.93a2.09,2.09,0,1,1,0,4.1h-3.2a24.83,24.83,0,0,1-5.07,14,18.41,18.41,0,0,1-6.17,5.21,19.38,19.38,0,0,1,6.1,5.67,28.67,28.67,0,0,1,5.13,14.44H43.8a2.09,2.09,0,1,1,0,4.1H2.47Z" />
              </svg>
            </CardDataStats>

            <CardDataStats
              title="Number of Test Cases Remaining"
              total={remainingTests}
            >
              <svg
                className="fill-primary dark:fill-white"
                width="20"
                height="22"
                viewBox="0 0 102.85 122.88"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M79.86,65.67a25,25,0,0,1,20.89,38.62l10.81,11.78-7.46,6.81L93.68,111.42A25,25,0,1,1,79.86,65.67Zm-42.65.26a2.74,2.74,0,0,1-2.6-2.84,2.71,2.71,0,0,1,2.6-2.84h15.4a2.76,2.76,0,0,1,2.6,2.84,2.71,2.71,0,0,1-2.6,2.84ZM22.44,57.22a5.67,5.67,0,1,1-5.67,5.67,5.67,5.67,0,0,1,5.67-5.67Zm2-18.58a2,2,0,0,1,2.85,0,2.07,2.07,0,0,1,0,2.89l-2,2,2,2a2,2,0,0,1,0,2.87,2,2,0,0,1-2.84,0l-2-2-2,2a2,2,0,0,1-2.86,0,2.07,2.07,0,0,1,0-2.89l2-2-2-2.05a2,2,0,0,1,2.87-2.86l2,2,2-2ZM16.85,21.52a2.29,2.29,0,0,1,3.16.63l1.13,1.36,4-5.05a2.27,2.27,0,1,1,3.51,2.88l-5.86,7.34a2.48,2.48,0,0,1-.55.52,2.28,2.28,0,0,1-3.16-.63l-2.84-3.89a2.28,2.28,0,0,1,.63-3.16Zm66.51-4.25h9.32a6.69,6.69,0,0,1,6.66,6.65v30.9c-.2,2.09-5.31,2.11-5.75,0V23.92a.93.93,0,0,0-.27-.67.91.91,0,0,0-.67-.27H83.32V54.82c-.49,1.89-4.75,2.18-5.71,0V6.66A1,1,0,0,0,77.34,6a.93.93,0,0,0-.67-.27h-70A.93.93,0,0,0,6,6a1,1,0,0,0-.27.68V85.79a1,1,0,0,0,.27.68.93.93,0,0,0,.67.27H44.74c2.88.29,3,5.27,0,5.71H21.66v10.61a.92.92,0,0,0,.94.94H44.74c2.09.24,2.76,5,0,5.71H22.64a6.54,6.54,0,0,1-4.7-2,6.63,6.63,0,0,1-2-4.7V92.45H6.66A6.69,6.69,0,0,1,0,85.79V6.66A6.54,6.54,0,0,1,2,2a6.61,6.61,0,0,1,4.7-2h70a6.55,6.55,0,0,1,4.7,2,6.65,6.65,0,0,1,2,4.7V17.27ZM37.18,26.44a2.75,2.75,0,0,1-2.6-2.84,2.71,2.71,0,0,1,2.6-2.84H63.86a2.74,2.74,0,0,1,2.6,2.84,2.71,2.71,0,0,1-2.6,2.84Zm0,19.74a2.74,2.74,0,0,1-2.6-2.83,2.71,2.71,0,0,1,2.6-2.84H63.86a2.74,2.74,0,0,1,2.6,2.84,2.7,2.7,0,0,1-2.6,2.83Z" />
              </svg>
            </CardDataStats>
            <CardDataStats
              title="Average time taken per test case (in secs)"
              total={averageTime}
            >
              <svg
                className="fill-primary dark:fill-white"
                width="20"
                height="22"
                viewBox="0 0 102.85 122.88"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M56.91,20.32C67.15,21.4,76.5,25.5,84.05,31.7l5.21-5.44c1.06-1.11,2.84-1.13,3.95-0.06l3.5,3.4 c1.1,1.07,1.12,2.84,0.06,3.94l-5.35,5.58c7.15,8.83,11.44,20.08,11.44,32.32c0,28.4-23.03,51.43-51.43,51.43 C23.03,122.88,0,99.85,0,71.45C0,58.63,4.7,46.9,12.46,37.89l-6.02-5.66c-1.12-1.05-1.15-2.83-0.09-3.94l3.37-3.53 c1.06-1.11,2.83-1.14,3.94-0.09l6.41,6.03c7.81-6.02,17.39-9.84,27.83-10.54V9h-9.9c-1.32,0-2.4-1.08-2.4-2.4V2.4 c0-1.32,1.08-2.4,2.4-2.4h28.8c1.32,0,2.4,1.08,2.4,2.4v4.2c0,1.32-1.08,2.4-2.4,2.4h-9.9V20.32L56.91,20.32z M47.24,52.63h4.39 c0.8,0,1.46,0.66,1.46,1.46v18.35h13.51c0.8,0,1.46,0.66,1.46,1.46v4.39c0,0.8-0.66,1.46-1.46,1.46H45.78V77.6v-5.16V54.09 C45.78,53.28,46.44,52.63,47.24,52.63L47.24,52.63z M51.43,29.69c23.06,0,41.76,18.7,41.76,41.76c0,23.06-18.7,41.76-41.76,41.76 c-23.06,0-41.76-18.7-41.76-41.76C9.67,48.39,28.37,29.69,51.43,29.69L51.43,29.69z"
                />
              </svg>
            </CardDataStats>
          </div>
        </div>
      </div>

      {/* Charts Section (1/2 each) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <div className="col-span-1 md:col-span-1">
          <OverallTestCaseStatus />
        </div>
        <div className="col-span-1 md:col-span-1">
          <OverallBrowserStatus />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
