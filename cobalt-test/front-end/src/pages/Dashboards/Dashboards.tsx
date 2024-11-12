// Dashboard.tsx
import React, { useState } from 'react';
import CardApplication from '../../components/Cards/CardApplication';
import DropdownSortBy from '../../components/Dropdowns/DropdownSortBy';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';

// Dummy data for applications
const dummyApplications = [
  { 
    id: 1, 
    title: 'Mobile Banking App', 
    imageSrc: '/path/to/imageA.jpg', 
    description: 'Access your accounts, make transfers, and manage your finances on the go.', 
    category: 'Banking' 
  },
  { 
    id: 2, 
    title: 'Budget Tracker', 
    imageSrc: '/path/to/imageB.jpg', 
    description: 'Keep track of your spending and create budgets to save money.', 
    category: 'Finance' 
  },
  { 
    id: 3, 
    title: 'Investment Portfolio Manager', 
    imageSrc: '/path/to/imageC.jpg', 
    description: 'Manage your investments and track market trends in real time.', 
    category: 'Investment' 
  },
  { 
    id: 4, 
    title: 'Loan Calculator', 
    imageSrc: '/path/to/imageD.jpg', 
    description: 'Calculate your loan payments and understand your financing options.', 
    category: 'Loans' 
  },
  { 
    id: 5, 
    title: 'Savings Goal Tracker', 
    imageSrc: '/path/to/imageE.jpg', 
    description: 'Set savings goals and track your progress towards financial milestones.', 
    category: 'Savings' 
  },
  { 
    id: 6, 
    title: 'Transaction History Viewer', 
    imageSrc: '/path/to/imageF.jpg', 
    description: 'View and filter your transaction history for easy account management.', 
    category: 'Account Management' 
  },
];

const Dashboard: React.FC = () => {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortOption, setSortOption] = useState<string>('title');

  const toggleFavorite = (appId: number) => {
    setFavorites((prevFavorites) => 
      prevFavorites.includes(appId)
        ? prevFavorites.filter((id) => id !== appId)
        : [...prevFavorites, appId]
    );
  };

  // Filter and sort applications
  const filteprimaryApplications = dummyApplications
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
      <div className="flex flex-wrap justify-between">
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

export default Dashboard;
