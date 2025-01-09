import React from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import NoCodeTestCaseInput from '../components/Cards/NoCodeTestCaseInput';

const NoCode: React.FC = () => {
  return (
    <>
      <Breadcrumb pageName = "No Code Test Case Creation"/>
      <NoCodeTestCaseInput />
    </>
  );
};

export default NoCode;
