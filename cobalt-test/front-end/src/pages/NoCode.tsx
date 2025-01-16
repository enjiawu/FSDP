import React from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import NoCodeTestCaseInput from '../components/NoCode/NoCodeTestCaseInput';

const NoCode: React.FC = () => {
  return (
    <>
      <Breadcrumb pageName = "No Code Test Case Creation"/>
      <div className="flex flex-col w-full h-full p-6 bg-gray-100 border border-gray-300 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700 cursor-pointer">
        <NoCodeTestCaseInput />
      </div>      
    </>
  );
};

export default NoCode;
