import React, { useState, ChangeEvent } from 'react';

interface FileUploadState {
    isUploading: boolean;
    fileName: string;
    progress: number;
    secondsLeft: number;
    uploadPercent: number;
}

const AddTestCase: React.FC = () => {
    const [testCaseName, setTestCaseName] = useState<string>('');
    const [testCaseDescription, setTestCaseDescription] = useState<string>('');
    const [file, setFile] = useState<File | null>(null);
    const [fileState, setFileState] = useState<FileUploadState>({
        isUploading: false,
        fileName: '',
        progress: 0,
        secondsLeft: 0,
        uploadPercent: 0,
    });

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const selectedFile = event.target.files[0];
            if (selectedFile.size > 10 * 1024 * 1024) {
                alert('File size exceeds 10 MB');
                return;
            }
            if (selectedFile.type !== 'application/javascript') {
                alert('Only .js files are allowed');
                return;
            }
            setFile(selectedFile);
            setFileState({
                ...fileState,
                fileName: selectedFile.name,
                isUploading: false,
                progress: 0,
                secondsLeft: 0,
                uploadPercent: 0,
            });
        }
    };

    const handleUpload = () => {
        if (!file) return;
        setFileState({ ...fileState, isUploading: true });

        let progress = 0;
        let secondsLeft = 0;
        const uploadInterval = setInterval(() => {
            progress += 10;
            secondsLeft = Math.max(0, 10 - Math.floor(progress / 10));
            if (progress >= 100) {
                clearInterval(uploadInterval);
                setFileState({
                    ...fileState,
                    progress: 100,
                    uploadPercent: 100,
                    secondsLeft: 0,
                });
            } else {
                setFileState((prevState) => ({
                    ...prevState,
                    progress,
                    uploadPercent: progress,
                    secondsLeft,
                }));
            }
        }, 1000);
    };

    const handlePause = () => {
        setFileState((prevState) => ({
            ...prevState,
            isUploading: false,
        }));
    };

    const handleCancel = () => {
        setFileState({
            isUploading: false,
            fileName: '',
            progress: 0,
            secondsLeft: 0,
            uploadPercent: 0,
        });
        setFile(null);
    };

    return (
        
        <div className="flex col-span-12 xl:col-span-5">
            {/* Left 2/3: Test Case Form */}
            <div className="w-2/3 mr-10">
                <div className="mb-4">
                    <label htmlFor="testCaseName" className="block text-sm font-medium text-gray-700 dark:text-white">
                        Test Case Name
                    </label>
                    <input
                        id="testCaseName"
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        placeholder="Enter test case name"
                        value={testCaseName}
                        onChange={(e) => setTestCaseName(e.target.value)}
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="testCaseDescription" className="block text-sm font-medium text-gray-700 dark:text-white">
                        Test Case Description
                    </label>
                    <textarea
                        id="testCaseDescription"
                        className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        placeholder="Enter test case description"
                        rows={5} 
                        value={testCaseDescription}
                        onChange={(e) => setTestCaseDescription(e.target.value)}
                    />
                </div>

                <button
                    onClick={handleUpload}
                    disabled={fileState.isUploading}
                    className="w-full py-2 bg-primary hover:bg-secondary text-white font-bold rounded-md disabled:bg-gray-300"
                >
                    {fileState.isUploading ? 'Uploading...' : 'Upload Test Case'}
                </button>
            </div>

            {/* Right 1/3: File Upload Area */}
            <div className="w-1/3">
                    <label htmlFor="fileUpload" className="cursor-pointer flex flex-col items-center justify-center">
                    <div className="flex flex-col items-center justify-center border border-dashed border-primary dark:border-gray-600 p-5 mb-2 rounded-md w-full">
                            <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fillRule="evenodd"
                            clipRule="evenodd"
                            imageRendering="optimizeQuality"
                            shapeRendering="geometricPrecision"
                            textRendering="geometricPrecision"
                            viewBox="0 0 512 364.92"
                            width="50"
                            height="50"
                            >
                            <path
                                    fill="#ED1C24" 
                                    fillRule="nonzero"
                                    d="M359.34 124.66c-13.56 6.7-25.71 15.36-37.41 24.9l-20.13-23.03c14.81-13.74 32.08-24.49 50.64-32.39-37.56-66.54-128.4-83.94-188.3-37.42-21.75 16.84-38.26 42.04-44.61 75.42l-2 10.43-10.4 1.84c-10.19 1.78-19.29 4.24-27.27 7.36-49.8 19.27-63.78 74.7-33.31 116.79 13.04 17.91 29.66 36.17 51.47 39.21h30.49c-.21 3-.32 6.02-.32 9.07 0 7.34.62 14.53 1.82 21.53H97.53l-1.92-.17c-30.53-3.88-55.62-26.61-73.75-51.72C-20.41 228.28.4 149.83 68.93 123.25c7.15-2.79 14.8-5.12 22.86-6.99 9.15-36.34 28.65-64.32 53.72-83.74C222.7-27.29 338.58-1.8 382.79 86.08c6.65-1.05 13.31-1.58 19.92-1.5 98.9.73 138.01 127.2 86.69 195.33-20.57 27.29-52.12 50.51-84.61 58.05l-3.41.41h-19.81a128.362 128.362 0 0 0 1.5-30.6h16.61c24.15-5.81 49.91-25.68 65.23-46.16 36.46-48.56 10.58-146.05-62.41-146.51-14.26-.12-29.11 3.33-43.16 9.56zM234.73 364.92h42.56c9.95 0 18.11-8.16 18.11-18.11v-58.64h31.04c6.54-.28 11.18-2.44 13.87-6.52 7.27-10.91-2.66-21.68-9.55-29.27-19.55-21.46-53.22-53.23-62.87-64.59-7.32-8.08-17.72-8.08-25.04 0-9.97 11.64-44.84 45.77-63.43 66.64-6.45 7.27-14.42 17.17-7.72 27.22 2.76 4.08 7.35 6.24 13.89 6.52h31.04v58.64c0 9.84 8.15 18.11 18.1 18.11z"
                            />
                            </svg>
                            <span className="text-sm text-primary dark:text-gray-300 mt-4">Click to browse or drag your file here</span>
                            <span className="text-xs text-gray-600 dark:text-gray-300 mt-1">Max 10 MB files are allowed</span>
                            </div>
                    </label>
                    <input
                            id="fileUpload"
                            type="file"
                            accept=".js"
                            className="hidden"
                            onChange={handleFileChange}
                    />

                <p className="text-xs text-gray-500 dark:text-gray-300">Only .js files supported</p>

                {/* File Upload Progress */}
            {fileState.isUploading && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 w-full border-gray-300 dark:border-gray-600 border mt-3">
                    {/* Header - File Name and Upload Percentage */}
                    <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-bold dark:text-white">Uploading "{fileState.fileName}"</p>
                            <div className="flex gap-4">
                                    {/* Pause Button */}
                                    <button
                                            onClick={handlePause}
                                            className="w-6 h-6 bg-gray-300 bg-opacity-50 border border-gray-400 text-gray-700 rounded-full flex items-center justify-center dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                                    >
                                            <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    className="w-4 h-4"
                                            >
                                                    <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M8 19V6m8 13V6"
                                                    />
                                            </svg>
                                    </button>

                                    {/* Cancel Button */}
                                    <button
                                            onClick={handleCancel}
                                            className="w-6 h-6 bg-red-500 bg-opacity-50 border border-red-600 text-primary rounded-full flex items-center justify-center dark:bg-red-700 dark:border-red-600 dark:text-white"
                                    >
                                            <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    className="w-4 h-4"
                                            >
                                                    <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M6 18L18 6M6 6l12 12"
                                                    />
                                            </svg>
                                    </button>
                            </div>
                    </div>

                    {/* Progress and Remaining Time */}
                    <div className="flex items-center mb-2">
                            <p className="text-sm dark:text-white">{fileState.uploadPercent}% • {fileState.secondsLeft} seconds remaining</p>
                    </div>

                    {/* Progress Bar */}
                    <div className="relative pt-1 mb-4">
                            <div className="flex mb-2 items-center justify-between">
                                    <div className="w-full bg-gray-300 rounded-full dark:bg-gray-600">
                                            <div
                                                    className="bg-blue-600 h-2 rounded-full"
                                                    style={{ width: `${fileState.uploadPercent}%` }}
                                            ></div>
                                    </div>
                            </div>
                    </div>
            </div>
            )}
            </div>
        </div>
    );
};

export default AddTestCase;
