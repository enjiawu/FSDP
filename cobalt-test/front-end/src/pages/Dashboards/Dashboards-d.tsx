// Dashboard.tsx
import React, { useState, useEffect } from 'react';
import CardApplication from '../../components/Cards/CardApplication';
import DropdownSortBy from '../../components/Dropdowns/DropdownSortBy';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';

// Dummy data for applications
const dummyApplications = [
  { 
    id: 1, 
    title: 'XYZ Bank', 
    imageSrc: './XYZ_icon.png', 
    description: 'Keep track of your spending and create budgets to save money.', 
    category: 'Finance',
  },
  { 
    id: 2, 
    title: 'Dashboard 1', 
    imageSrc: './dashboard.png', 
    description: 'Keep track and manage your applications in real-time.', 
    category: 'Analytics',
  },
];


const Dashboards: React.FC = () => {
  const [assignedApps, setAssignedApps] = useState<string[]>([]); // Array to store assigned app names
  const [applications, setApplications] = useState<any[]>(dummyApplications);  // Store all applications
  const [favorites, setFavorites] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortOption, setSortOption] = useState<string>('title');
  const [userRole, setUserRole] = useState<string | null>(null);

  const toggleFavorite = (appId: number) => {
    setFavorites((prevFavorites) => 
      prevFavorites.includes(appId)
        ? prevFavorites.filter((id) => id !== appId)
        : [...prevFavorites, appId]
    );
  };

  const decodeToken = (token: string) => {
    try {
      const payloadBase64 = token.split('.')[1]; // Extract the payload part of the token
      const decodedPayload = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/')); // Decode Base64URL
      return JSON.parse(decodedPayload); // Parse the JSON string
    } catch (error) {
      console.error('Error decoding token:', error);
      return null; // Return null if decoding fails
    }
  };

  // TODO:: Remove this 
  useEffect(() => {
    //setFavorites(dummyApplications.map(app => app.id));
    const fetchAssignedApps = async () => {
        try {
          const token = localStorage.getItem('token');

          if (!token) {
            throw new Error('No token found in localStorage.');
          }
    
          const decoded = decodeToken(token); // Decode the token
          if (!decoded || !decoded.username) {
            throw new Error('Invalid token payload.');
          }
    
          const username = decoded.username; // Extract the username from the decoded payload
          setUserRole(decoded.role);

          if (decoded.role === 'admin') {
            // Admins can view all dashboards
            setAssignedApps(dummyApplications.map((app) => app.title));
            return;
          }

          const response = await fetch(`http://localhost:3000/assignedApps/${username}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`, // Replace with your auth mechanism
            },
          });
  
          if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
          }
  
          const data = await response.json();
          setAssignedApps(data); // Assuming the response is an array of application names
        } catch (error) {
          console.error('Error fetching assigned apps:', error);
        }
      };
  
      fetchAssignedApps();
  }, []);

  const filteredApplications = userRole === 'admin' ?
  applications :
  applications.filter((app) => assignedApps.includes(app.title));

  // Filter and sort applications
  const filteprimaryApplications = filteredApplications
    .filter(app => app.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortOption === 'title') {
        return a.title.localeCompare(b.title);
      } else if (sortOption === 'category') {
        return a.category.localeCompare(b.category);
      }
      return 0; 
    });


  return (
    <div>
      <Breadcrumb pageName = "All dashboards"/>

      {/* Search and Sort Container */}
      <div className="flex items-center mb-4">
        <div className="relative flex-grow mr-4">
          <input
            type="text"
            placeholder="Search applications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded-md pl-10 pr-4 py-2 w-full dark:bg-black dark:text-white"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-2 top-2 h-6 w-5 text-gray-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 21l-4.35-4.35M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z" />
          </svg>
        </div>

        <DropdownSortBy
        value={sortOption} 
          onChange={setSortOption}
          options={[
            { value: 'title', label: 'Title' },
            { value: 'category', label: 'Category' },
          ]}
        />
      </div>

      {/* Flexbox container for cards */}
      <div className="flex flex-wrap justify-start">
        {filteprimaryApplications.map((app) => (
          <div key={app.id} className="w-full sm:w-1/2 md:w-1/3 p-2">
            <CardApplication
              title={app.title}
              imageSrc={app.imageSrc}
              description={app.description}
              category={app.category}
              isFavorite={favorites.includes(app.id)}
              onToggleFavorite={() => toggleFavorite(app.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboards;
