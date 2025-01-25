import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TrashIcon } from '@heroicons/react/solid';

interface FileUploadState {
    isUploading: boolean;
    fileName: string;
    progress: number;
    secondsLeft: number;
    uploadPercent: number;
}

interface TestCaseFormData {
    testCaseName: string;
    description: string;
    purpose: string;
    expectedOutcome: string;
    steps: string[];
}

const AddTestCase: React.FC = () => {
    const { appTitle } = useParams();
    const navigate = useNavigate();
    
    const [testCaseData, setTestCaseData] = useState<TestCaseFormData>({
        testCaseName: '',
        description: '',
        purpose: '',
        expectedOutcome: '',
        steps: [''],
    });

    const [file, setFile] = useState<File | null>(null);
    const [fileState, setFileState] = useState<FileUploadState>({
        isUploading: false,
        fileName: '',
        progress: 0,
        secondsLeft: 0,
        uploadPercent: 0,
    });
    const [uploadedFiles, setUploadedFiles] = useState<Array<{name: string, status: string}>>([]);

    const handleInputChange = (field: keyof TestCaseFormData, value: string | string[]) => {
        setTestCaseData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        
        if (selectedFile) {
            if (!selectedFile.name.endsWith('.js')) {
                toast.error('Only JavaScript (.js) files are allowed');
                e.target.value = ''; // Reset file input
                setFile(null);
                return;
            }
            
            setFile(selectedFile);
            setFileState(prev => ({
                ...prev,
                fileName: selectedFile.name
            }));
            toast.info('File selected: ' + selectedFile.name);
        }
    };

    const handleStepChange = (index: number, value: string) => {
        const newSteps = [...testCaseData.steps];
        newSteps[index] = value;
        handleInputChange('steps', newSteps);
    };

    const addStep = () => {
        handleInputChange('steps', [...testCaseData.steps, '']);
    };

    const removeStep = (index: number) => {
        const newSteps = testCaseData.steps.filter((_, i) => i !== index);
        handleInputChange('steps', newSteps);
    };

    const validateForm = (): boolean => {
        return (
            testCaseData.testCaseName.trim() !== '' &&
            testCaseData.description.trim() !== '' &&
            testCaseData.purpose.trim() !== '' &&
            testCaseData.expectedOutcome.trim() !== '' &&
            testCaseData.steps.every(step => step.trim() !== '') &&
            file !== null
        );
    };

    const handleUpload = async () => {
        if (!validateForm()) {
            toast.error('Please fill in all required fields');
            return;
        }
    
        const filePath = `${appTitle}/testcases/${testCaseData.testCaseName}.js`;
        setFileState(prev => ({ ...prev, isUploading: true }));
        const formData = new FormData();
        
        // Add file and metadata to FormData
        formData.append('file', file as File);
        formData.append('application', appTitle || '');
        formData.append('filePath', filePath);
        formData.append('testCaseName', testCaseData.testCaseName);
        formData.append('testCaseDescription', testCaseData.description);
        
        Object.entries(testCaseData).forEach(([key, value]) => {
            formData.append(key, Array.isArray(value) ? JSON.stringify(value) : value);
        });
    
        try {
            const response = await fetch('http://localhost:3000/upload-testcase', {
                method: 'POST',
                body: formData,
                // Remove the Content-Type header - browser will set it automatically with boundary
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Upload failed');
            }
    
            const result = await response.json();
            
            if (result.success) {
                toast.success(`Test case "${testCaseData.testCaseName}" uploaded successfully!`);
                setUploadedFiles(prev => [...prev, { 
                    name: testCaseData.testCaseName, 
                    status: 'success',
                    path: filePath 
                }]);
                resetForm();
            }
        } catch (error) {
            toast.error(`Upload failed: ${error}`);
            console.error('Upload error:', error);
        } finally {
            setFileState(prev => ({ ...prev, isUploading: false }));
        }
    };    

    const resetForm = () => {
        setTestCaseData({
            testCaseName: '',
            description: '',
            purpose: '',
            expectedOutcome: '',
            steps: [''],
        });
        setFile(null);
        setFileState({
            isUploading: false,
            fileName: '',
            progress: 0,
            secondsLeft: 0,
            uploadPercent: 0,
        });
    };

    return (
        <div>
            {/* Test Case Name */}
            <FormField
                label="Test Case Name"
                required
                value={testCaseData.testCaseName}
                onChange={(e) => handleInputChange('testCaseName', e.target.value)}
            />

            {/* Description */}
            <FormField
                label="Description"
                required
                isTextArea
                value={testCaseData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
            />

            {/* Purpose */}
            <FormField
                label="Purpose"
                required
                isTextArea
                value={testCaseData.purpose}
                onChange={(e) => handleInputChange('purpose', e.target.value)}
            />

            {/* Expected Outcome */}
            <FormField
                label="Expected Outcome"
                required
                isTextArea
                value={testCaseData.expectedOutcome}
                onChange={(e) => handleInputChange('expectedOutcome', e.target.value)}
            />

            {/* Steps */}
            <div className="space-y-2">
                <label className="block text-black dark:text-white">
                    Test Steps <span className="text-meta-1">*</span>
                </label>
                {testCaseData.steps.map((step, index) => (
                    <div key={index} className="flex gap-2">
                        <input
                            type="text"
                            value={step}
                            onChange={(e) => handleStepChange(index, e.target.value)}
                            placeholder={`Step ${index + 1}`}
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 dark:border-form-strokedark dark:bg-form-input"
                        />
                        {testCaseData.steps.length > 1 && (
                            <button
                                onClick={() => removeStep(index)}
                                className="bg-danger p-3 rounded-sm"
                            >
                                <TrashIcon className="h-5 w-5 text-white" />
                            </button>
                        )}
                    </div>
                ))}
                <button
                    type="button"
                    onClick={addStep}
                    className="bg-primary text-white px-4 py-2 rounded-sm"
                >
                    Add Step
                </button>
            </div>

            {/* File Upload */}
            <div>
                <label className="mb-2.5 mt-5 block text-black dark:text-white">
                    Test Script File <span className="text-meta-1">*</span>
                </label>
                <input
                    type="file"
                    accept=".js"
                    onChange={handleFileChange}
                    className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent font-medium outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:px-5 file:py-3 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white"
                />
            </div>

            {/* Upload Button */}
            <button
                onClick={handleUpload}
                disabled={fileState.isUploading || !validateForm()}
                className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray disabled:opacity-50 mt-7"
            >
                {fileState.isUploading ? 'Uploading...' : 'Upload Test Case'}
            </button>
        </div>
    );
};

const FormField: React.FC<{
    label: string;
    required?: boolean;
    isTextArea?: boolean;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}> = ({ label, required, isTextArea, value, onChange }) => (
    <div>
        <label className="mb-2.5 block text-black dark:text-white">
            {label} {required && <span className="text-meta-1">*</span>}
        </label>
        {isTextArea ? (
            <textarea
                value={value}
                onChange={onChange}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 dark:border-form-strokedark dark:bg-form-input"
                rows={4}
            />
        ) : (
            <input
                type="text"
                value={value}
                onChange={onChange}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 dark:border-form-strokedark dark:bg-form-input"
            />
        )}
    </div>
);

export default AddTestCase;
