import React, { useState, useEffect } from 'react';
import '../../css/general.css';
import DropdownSortBy from '../Dropdowns/DropdownSortBy';
import { runSelectedTestRequest } from '../../../../back-end/runTestRequest';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FaEdit, FaSave, FaTrash } from 'react-icons/fa';

interface TestCase {
    id: number;
    title: string;
    description: string;
    timeTaken: number;
    successRate: number;
    dateAdded: string;
    reporter: string;
    application?: string;
    codeContent?: string;
}


const AllTestCasesTable = () => {
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [tooltipContent, setTooltipContent] = useState<string | null>(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'id-asc' | 'id-desc' | 'title-asc' | 'title-desc' | 'successRate-asc' | 'successRate-desc' | 'dateAdded-asc' | 'dateAdded-desc' | 'reporter-asc' | 'reporter-desc'>('id-asc');
  const [selectedTestCases, setSelectedTestCases] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [modalContent, setModalContent] = useState<TestCase | null>(null);

  const [editedTestCase, setEditedTestCase] = useState<TestCase>({
      id: 0,
      title: '',
      description: '',
      timeTaken: 0,
      successRate: 0,
      dateAdded: new Date().toISOString().split('T')[0],
      reporter: '',
  });

  const handleDelete = async (testCaseId: number, title: string) => {
    if (window.confirm('Are you sure you want to delete this test case?')) {
        try {
            const response = await fetch(`http://localhost:3000/delete-testcase/${title}/${testCaseId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert('Test case deleted successfully');
                setModalContent(null);
                setEditMode(false);
                fetchTestCases(); // Refresh the list
            }
        } catch (error) {
            console.error('Error deleting test case:', error);
        }
      }
    };

  const openModal = async (testCase: TestCase) => {
    try {
        const response = await fetch(`http://localhost:3000/test-script/${testCase.title}`);
        const codeContent = await response.text();
        
        setModalContent({
            ...testCase,
            codeContent
        });
        setEditedTestCase({
            ...testCase,
            codeContent
        });
    } catch (error) {
        console.error('Error fetching test script:', error);
    }
};


  // Fetch test cases from the backend
  const fetchTestCases = async () => {
    try {
      const response = await fetch('http://localhost:3000/alltestcases'); // Adjust this endpoint to match your backend
      const data = await response.json();
      setTestCases(data);
    } catch (error) {
      console.error('Error fetching test cases:', error);
    }
  };

  useEffect(() => {
    fetchTestCases();
  }, []);

  const filteredTestCases = testCases.filter(testCase =>
    testCase.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectTestCase = (id: number) => {
    setSelectedTestCases(prev =>
      prev.includes(id) ? prev.filter(testCaseId => testCaseId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setSelectedTestCases(selectAll ? [] : testCases.map(testCase => testCase.id));
  };

  
  const handleEdit = async () => {
    if (!editedTestCase) return;
    
    const formData = new FormData();
    if (modalContent) {
        formData.append('originalTestCaseName', modalContent.title); // Add original name
    }
    formData.append('testCaseName', editedTestCase.title);
    formData.append('testCaseDescription', editedTestCase.description);
    formData.append('reporter', editedTestCase.reporter);
    formData.append('application', editedTestCase.application || '');

    const codeBlob = new Blob([editedTestCase.codeContent || ''], { type: 'text/javascript' });
    formData.append('file', codeBlob, `${editedTestCase.title}.js`);

    const response = await fetch('http://localhost:3000/update-testcase', {
        method: 'POST',
        body: formData
    });

    if (response.ok) {
        alert('Test case updated successfully!');
        setEditMode(false);
        fetchTestCases(); // Refresh the list
    } else {
        const errorData = await response.json();
        alert('Failed to update test case: ' + errorData.error);
    }
  };


  const handleTestButtonClick = () => {
    const selectedTestCaseTitles = testCases
      .filter((testCase) => selectedTestCases.includes(testCase.id))
      .map((testCase) => testCase.title);

    console.log('Testing selected test cases:', selectedTestCaseTitles);
    
    // Call the API endpoint to run the selected tests
    runSelectedTestRequest(selectedTestCaseTitles);
  };
  
  const sortedTestCases = filteredTestCases.sort((a, b) => {
    switch (filter) {
      case 'id-asc':
        return a.id - b.id;
      case 'id-desc':
        return b.id - a.id;
      case 'title-asc':
        return a.title.localeCompare(b.title);
      case 'title-desc':
        return b.title.localeCompare(a.title);
      case 'successRate-asc':
        return a.successRate - b.successRate;
      case 'successRate-desc':
        return b.successRate - a.successRate;
      case 'dateAdded-asc':
        return new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime();
      case 'dateAdded-desc':
        return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      case 'reporter-asc':
        return a.reporter.localeCompare(b.reporter);
      case 'reporter-desc':
        return b.reporter.localeCompare(a.reporter);
      default:
        return 0;
    }
  });

  const showTooltip = (event: React.MouseEvent<HTMLElement>, content: string) => {
    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    
    setTooltipContent(content);
    setTooltipVisible(true);
    
    // Position the tooltip right above the text and centered horizontally
    setTooltipPosition({
      top: rect.top + window.scrollY + 430, 
      left: rect.left + window.scrollX + rect.width / 2 - 400, // Adjusted to center the tooltip
    });
  };
  
  const hideTooltip = () => {
    setTooltipVisible(false);
  };


  const handleTestCaseTitleClick = (testCase: TestCase) => {
    // Redirect to the source control link when a test case title is clicked
    const filePath = `https://github.com/enjiawu/OCBC_Applications/blob/main/XYZBank/${testCase.title}`;  // Replace with your actual source control path
    window.open(filePath, '_blank'); 
  };

  return (
    <div className="rounded-md bg-white p-6 shadow-md dark:border-strokedark dark:bg-boxdark">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-black dark:text-white">All Test Cases</h2>
        <div className="flex items-center">
          <div className="relative mr-4">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                className="h-5 w-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1116.65 2a7.5 7.5 0 010 14.65z"
                />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search Test Cases..."
              className="border border-gray-400 rounded p-2 pl-10 pr-15 dark:bg-black dark:text-white"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <DropdownSortBy 
            value={filter}
            onChange={(value) => setFilter(value as 'id-asc' | 'id-desc' | 'title-asc' | 'title-desc' | 'successRate-asc' | 'successRate-desc' | 'dateAdded-asc' | 'dateAdded-desc' | 'reporter-asc' | 'reporter-desc')}
            options={[
              { label: 'ID (asc)', value: 'id-asc' },
              { label: 'ID (desc)', value: 'id-desc' },
              { label: 'Title (asc)', value: 'title-asc' },
              { label: 'Title (desc)', value: 'title-desc' },
              { label: 'Success Rate (asc)', value: 'successRate-asc' },
              { label: 'Success Rate (desc)', value: 'successRate-desc' },
              { label: 'Date Added (asc)', value: 'dateAdded-asc' },
              { label: 'Date Added (desc)', value: 'dateAdded-desc' },
              { label: 'Reporter (asc)', value: 'reporter-asc' },
              { label: 'Reporter (desc)', value: 'reporter-desc' },
            ]}
          />
        </div>
      </div>

      <button 
        onClick={handleTestButtonClick}
        className="mt-4 mb-5 bg-primary hover:bg-secondary text-white font-bold disabled:bg-gray-300 px-6 py-2 rounded-md"
      >
        Test Selected
      </button>

      <div className="max-w-full overflow-x-auto h-100">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                <input 
                  type="checkbox" 
                  checked={selectAll} 
                  onChange={handleSelectAll} 
                />
              </th>
              <th className="min-w-[50px] py-4 px-4 font-medium text-black dark:text-white">ID</th>
              <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white">Test Case</th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">Description</th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">Time Taken (s)</th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">Success Rate (%)</th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">Date Added</th>
              <th className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white">Reporter</th>
              <th className="min-w-[50px] py-4 px-4 font-medium text-black dark:text-white">Edit</th>
            </tr>
          </thead>
          <tbody>
            {sortedTestCases.map((testCase) => (
              <tr key={testCase.id} className="border-b dark:border-strokedark">
                <td className="py-4 px-4">
                  <input 
                    type="checkbox" 
                    checked={selectedTestCases.includes(testCase.id)} 
                    onChange={() => handleSelectTestCase(testCase.id)} 
                  />
                </td>
                <td className="py-4 px-4">{testCase.id}</td>
                <td className="py-4 px-4 cursor-pointer text-primary underline" onClick={() => handleTestCaseTitleClick(testCase)}>{testCase.title}</td>
                <td className="py-4 px-4" onMouseEnter={(e) => showTooltip(e, testCase.description)} onMouseLeave={hideTooltip}>
                  {testCase.description}
                </td>
                <td className="py-4 px-4 ">{testCase.timeTaken}</td>
                <td className="py-4 px-4">{testCase.successRate}</td>
                <td className="py-4 px-4">{testCase.dateAdded}</td>
                <td className="py-4 px-4">{testCase.reporter}</td>
                <td className="py-4 px-4">
                  <button onClick={() => openModal(testCase)} className="text-blue-500">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {tooltipVisible && tooltipContent && (
        <div 
          className="tooltip-content"
          style={{ top: `${tooltipPosition.top}px`, left: `${tooltipPosition.left}px` }}
        >
          {tooltipContent}
        </div>
      )}
      
      {modalContent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 mt-15">
          <div className="bg-white rounded-lg w-4/5 max-h-[85vh] overflow-hidden flex flex-col dark:bg-black dark:border dark:border-white transform translate-x-[10%]">
              <div className="sticky top-0 bg-white dark:bg-black p-6 border-b border-gray-200 z-10">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Edit Test Case</h2>
                    <div className="flex space-x-2">
                        <button onClick={() => setEditMode(!editMode)}
                                className="flex items-center px-4 py-2 border border-primary text-primary rounded-lg">
                            <FaEdit className="mr-2" />{editMode ? 'View' : 'Edit'}
                        </button>
                        <button onClick={handleEdit}
                                className="flex items-center px-4 py-2 bg-primary text-white rounded-lg">
                            <FaSave className="mr-2" />Save
                        </button>
                        <button 
                            onClick={() => handleDelete(editedTestCase?.id, editedTestCase?.title)}
                            className="flex items-center px-4 py-2 bg-danger text-white rounded-lg"
                        >
                            <FaTrash className="mr-2" />Delete
                        </button>
                        <button 
                            onClick={() => {
                                setModalContent(null);
                                setEditMode(false);
                            }}
                            className="flex items-center px-4 py-2 bg-danger text-white rounded-lg"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-auto p-6">
                <div className="grid grid-cols-2 gap-8 h-full">
                        <h3 className="text-lg font-medium mb-4">Test Case Details</h3>
                        {editMode ? (
                            <form className="space-y-4">
                                <input 
                                    value={editedTestCase?.title}
                                    onChange={e => setEditedTestCase(prev => ({...prev!, title: e.target.value}))}
                                    className="w-full p-2 border rounded dark:bg-slate-950"
                                    placeholder="Test Case Title"
                                />
                                <textarea 
                                    value={editedTestCase?.description}
                                    onChange={e => setEditedTestCase(prev => ({...prev!, description: e.target.value}))}
                                    className="w-full p-2 border rounded dark:bg-slate-950"
                                    placeholder="Description"
                                /> 
                            </form>
                        ) : (
                            <div className="space-y-4">
                                <p><strong>Title:</strong> {modalContent.title}</p>
                                <p><strong>Description:</strong> {modalContent.description}</p>
                            </div>
                        )}
                    </div>

                    <div className="overflow-auto max-h-[calc(100vh-20rem)]">
                      <h3 className="text-lg font-medium mb-4 sticky top-0 bg-white dark:bg-black">Test Script</h3>
                      {editMode ? (
                          <textarea
                              value={editedTestCase?.codeContent}
                              onChange={e => setEditedTestCase(prev => ({...prev!, codeContent: e.target.value}))}
                              className="w-full min-h-[200px] p-4 bg-[#1e1e1e] text-white font-mono"
                              style={{ height: 'auto', resize: 'vertical' }}
                          />
                      ) : (
                          <SyntaxHighlighter
                              language="javascript"
                              style={vscDarkPlus}
                              showLineNumbers
                              customStyle={{
                                  minHeight: '200px',
                                  margin: 0,
                                  borderRadius: '0.5rem',
                              }}
                          >
                              {editedTestCase?.codeContent || ''}
                          </SyntaxHighlighter>
                      )}
                  </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default AllTestCasesTable;
