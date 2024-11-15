const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://josephbwanzj:josephwan1*@testresults.szcjd.mongodb.net/'; // MongoDB URI

// Define the test case update logic
const testCaseUpdate = () => {
  MongoClient.connect(uri)
    .then(client => {
        // Define both databases
        const testResultsDB = client.db('app_test_results'); // DB for test results
        const testCasesDB = client.db('app_testcases'); // DB for test cases

        // Define collections in each database
        const testResultsCollection = testResultsDB.collection('testResults');
        const testCaseCollection = testCasesDB.collection('testCasesXYZ');

        // Create a Change Stream on the testResults collection
        const changeStream = testResultsCollection.watch();

        // Listen for changes in the testResults collection
        changeStream.on('change', async (change) => {
        console.log('Change detected in test results:', change);
        if (change.operationType === 'insert') {
            const newTestResult = change.fullDocument;

            const { testName, status, startTime, endTime } = newTestResult;
            console.log(`Test name from test result: ${testName}`);

            // Calculate the time difference (in seconds) between startTime and endTime
            const timeTaken = (new Date(endTime) - new Date(startTime)) / 1000;

            // Find the corresponding test case based on the test name
            const testCase = await testCaseCollection.findOne({ TestCase: testName });
            console.log("Test Case: ", testCase);

            if (testCase) {
                await testCaseCollection.updateOne(
                { TestCase: testName }, // Use test name to find the matching test case
                {
                    $set: {
                    status, // Update the status
                    TimeTaken: timeTaken, // Update the time taken
                    },
                }
            );
            console.log(`Test case "${testName}" updated with new status and time taken.`);
            } else {
            console.log(`Test case with name "${testName}" not found.`);
            }
        }
        });
    })
    .catch(err => {
        console.error('Error connecting to MongoDB:', err);
    });
};

// Export the testCaseUpdate to be used in server.js
module.exports = testCaseUpdate;
