import React, { useState } from 'react';

interface DropdownProps {
    label: string;
    options: { value: string; label: string }[];
    onSelect: (value: string) => void;
    selected: string | null;
}

const Dropdown: React.FC<DropdownProps> = ({ label, options, onSelect, selected }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative w-full mt-4">
            <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">
                {label}
            </label>
            <div
                className="relative w-full p-3 text-base border border-stroke bg-gray py-3 px-4.5 text-black dark:border-strokedark dark:bg-meta-4 rounded-lg dark:text-gray-200 focus:outline-none focus:ring focus:ring-primary cursor-pointer flex justify-between items-center"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>
                    {selected ? options.find((opt) => opt.value === selected)?.label : `Select ${label}`}
                </span>
                <svg
                    className={`w-5 h-5 transform ${isOpen ? 'rotate-180' : ''}`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M10 3a1 1 0 01.707.293l5 5a1 1 0 01-1.414 1.414L10 5.414l-4.293 4.293A1 1 0 014.293 8.293l5-5A1 1 0 0110 3z"
                        clipRule="evenodd"
                    />
                </svg>
            </div>
            {isOpen && (
                <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg dark:bg-gray-700 dark:border-gray-600">
                    {options.map((option) => (
                        <li
                            key={option.value}
                            onClick={() => {
                                onSelect(option.value);
                                setIsOpen(false);
                            }}
                            className="p-3 text-base cursor-pointer hover:bg-red-500 hover:text-white"
                        >
                            {option.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

const NoCodeTestCaseInput: React.FC = () => {
    const [selectedApplication, setSelectedApplication] = useState<string | null>(null);
    const [testCaseName, setTestCaseName] = useState("");
    const [testCaseDescription, setTestCaseDescription] = useState("");
    const [testCaseSteps, setTestCaseSteps] = useState("");
    const [expectedResult, setExpectedResult] = useState("");
    const [generatedTestCase, setGeneratedTestCase] = useState("");

    const applicationOptions = [ // TODO:: Replace with actual data
        { value: "Dashboard-1", label: "Dashboard 1" },
        { value: "XYZ-Bank", label: "XYZ Bank" },
    ];

    const handleGenerateTestCase = async () => {
        try {
            const response = await fetch("http://localhost:3000/generatetestcase", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                testCaseName,
                testCaseDescription,
                testCaseApplication: selectedApplication,
                testCaseSteps,
                testCaseExpectedResults: expectedResult}),
            });

            if (!response.ok) {
                throw new Error('Response not ok.');
            }
        
            const data = await response.json();
        
            if (response.status === 200) {
                setGeneratedTestCase(data.testCase);
            } else {
                alert(data.error);
            }
            
        } catch (error) {
            console.error("Error generating test case:", error);
        }
    };

    return (
        <div className="flex flex-col w-full h-full  dark:bg-gray-800  cursor-pointer">
            {/* Test Case Name */}
            <label className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">
                Test Case Name:
            </label>
            <input
                type="text"
                className="p-3 text-base border border-stroke bg-gray py-3 px-4.5 text-black dark:border-strokedark dark:bg-meta-4 rounded-lg dark:text-gray-200 focus:outline-none focus:ring focus:ring-primary"
                placeholder="Enter Test Case Name"
            />

            {/* Test Case Description */}
            <label className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">
                Test Case Description:
            </label>
            <textarea
                className="p-3 text-base border border-stroke bg-gray py-3 px-4.5 text-black dark:border-strokedark dark:bg-meta-4 rounded-lg dark:text-gray-200 focus:outline-none focus:ring focus:ring-primary"
                placeholder="Enter Test Case Description"
                rows={4}
            />

            {/* Application Dropdown */}
            <Dropdown
                label="Application"
                options={applicationOptions}
                onSelect={setSelectedApplication}
                selected={selectedApplication}
            />

            {/* Test Case Steps */}
            <label className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">
                Test Case Steps:
            </label>
            <textarea
                className="p-3 text-base border border-stroke bg-gray py-3 px-4.5 text-black dark:border-strokedark dark:bg-meta-4 rounded-lg dark:text-gray-200 focus:outline-none focus:ring focus:ring-primary"
                placeholder="Enter Test Case Steps"
                rows={10}
            />

            {/* Expected Result */}
            <label className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">
                Expected Result:
            </label>
            <textarea
                className="p-3 text-base border border-stroke bg-gray py-3 px-4.5 text-black dark:border-strokedark dark:bg-meta-4 rounded-lg dark:text-gray-200 focus:outline-none focus:ring focus:ring-primary"
                placeholder="Enter Expected Result"
                rows={4}
            />

            <button
                onClick={handleGenerateTestCase}
                className="w-full py-2 mt-8 bg-primary hover:bg-secondary text-white font-bold rounded-md disabled:bg-gray-300"
            >
                Generate Test Case
            </button>

                {/* Display generated test case */}
                {generatedTestCase && (
                    <div className="mt-6 p-4 bg-gray-200 rounded-lg dark:bg-gray-700">
                        <h3 className="text-lg font-medium">Generated Test Case</h3>
                        <pre>{generatedTestCase}</pre>
                    </div>
                )}
        </div>
    );
};

export default NoCodeTestCaseInput;
