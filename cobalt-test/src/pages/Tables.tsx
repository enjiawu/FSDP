import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import TableOne from '../components/Tables/TestCaseTable';
import TableThree from '../components/Tables/ApplicationTestedTable';
import TableTwo from '../components/Tables/AllTestCasesTable';

const Tables = () => {
  return (
    <>
      <Breadcrumb pageName="Tables" />

      <div className="flex flex-col gap-10">
        <TableOne />
        <TableTwo />
        <TableThree />
      </div>
    </>
  );
};

export default Tables;
