const { exec } = require('child_process');
const { MongoClient } = require('mongodb');
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');
const fs = require('fs').promises;

const browsers = ['chrome', 'firefox', 'edge', 'opera']
const testFolder = '../back-end/test_cases';
//const checkBrowserAvailability = require('./browserController');
const uri = 'mongodb+srv://josephbwanzj:josephwan1*@testresults.szcjd.mongodb.net/'

// Create MongoDB client
const client = new MongoClient(uri);

async function sendTestResultsEmail(historyEntry, username) {
    // Create a transporter
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "cobalttestnp@gmail.com",
            pass: "wmgf wrxi jzci qipz",
        },
    });

    const failedTestsHTML = historyEntry.failedTests.length
            ? `<h3>Failed Tests:</h3><ul>${historyEntry.failedTests
                .map((test) => `<li><b>${test.testID}:</b> ${test.testName}</li>`)
                .join("")}</ul>`
            : "<p>No failed tests</p>";

    // Email options
    const mailOptions = {
        from: "cobalttestnp@gmail.com",
        to: username,
        subject: "Test Result from CobaltTest",
        html: `
                <h2>Test Execution Summary</h2>
                <p><b>Test Run ID:</b> ${historyEntry.historyId}</p>
                <p><b>Date & Time:</b> ${historyEntry.dateTime}</p>
                <p><b>Status:</b> ${historyEntry.status}</p>
                <p><b>Passed:</b> ${historyEntry.passed}</p>
                <p><b>Failed:</b> ${historyEntry.failed}</p>
                ${failedTestsHTML}
            `,
        };
        
    // Send email
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.response);
    } catch (error) {
        console.error("Error sending email:", error);
    }

};


const runTest = async (req, res) => {
    //res.json({ message: 'Test execution started' });
    /*
    const { continueWithAvailable } = req.body;
    const { availableBrowsers, missingBrowsers } = checkBrowserAvailability();
    if (missingBrowsers.length > 0 && !continueWithAvailable) {
        return res.status(500).json({
            message: 'Some browsers are missing',
            missingBrowsers
        });
    }
    const browsersToUse = availableBrowsers.join(',');
    */

    // Connect to MongoDB
    await client.connect();

    // Specify the database and collections
    const testResultsDb = client.db('app_test_results');
    const pendingTestsCollection = testResultsDb.collection('pendingTests');

    const testFiles = await fs.readdir(testFolder);
    const numberOfTestCases = testFiles.length;
    console.log("Length:", testFiles.length);
    // Generate 8 pending test cases
    const pendingTestCases = Array.from({ length: parseInt(numberOfTestCases) }, (_, i) => ({
        testID: i + 1,
        testName: `Test Case ${i + 1}`,
        status: 'Pending',
        createdAt: new Date(),
    }));

    // Insert pending test cases into the collection
    await pendingTestsCollection.insertMany(pendingTestCases);

    console.log('Pending test cases added to the collection.');
    exec(`testcafe ${browsers} ${testFolder} -- concurrency 2`, async (error, stdout, stderr) => {
        console.log(stdout);
        

        // Initialize counts
        let passCount = 0;
        let failCount = 0;

        // Split stdout into lines and count the passed/failed test cases
        const lines = stdout.split('\n');

        // Loop through the lines and find the summary
        lines.forEach(line => {
            // Look for a line that has the format 'X/Y failed' in the summary
            const failMatches = line.match(/(\d+)\/(\d+) failed/);
            if (failMatches) {
                // Parse the number of failed and total tests
                failCount = parseInt(failMatches[1]);
                const totalCount = parseInt(failMatches[2]);
                passCount = totalCount - failCount; // Calculate passed tests
            }

            // Look for a line that has the format 'X passed'
            const passMatches = line.match(/(\d+) passed/);
            if (passMatches) {
                // If no failures are found, we can use the passed count to set the passed count
                passCount = parseInt(passMatches[1]);
            }
        });

        const failedTests = [];

        // Regex pattern to find passed and failed tests
        const failedTestPattern = /testID: (\d+),\s*testName: '(.*)',\s*status: 'Failed'/g;
        let match;
        
        // Loop through all failed tests in the stdout
        while ((match = failedTestPattern.exec(stdout)) !== null) {
            const testID = match[1];  // The test ID of the failed test
            const testName = match[2]; // The test name of the failed test
            
            // Store the failed tests grouped by testID
            failedTests.push({ testID, testName });
        }
        
        // Determine status based on pass/fail counts
        const status = failCount > 0 ? 'Failed' : 'Passed';

        // Connect to MongoDB
        await client.connect();
        const db = client.db('app_testhistory'); // use your DB name
        const historyCollection = db.collection('testHistory');

        // Find the highest current historyId (assuming historyId is a number)
        const lastEntry = await historyCollection.find().sort({ historyId: -1 }).limit(1).toArray();
        const newHistoryId = lastEntry.length > 0 ? lastEntry[0].historyId + 1 : 1; // Increment the last ID or start at 1 if none exist

        // Create a new history entry
        const historyEntry = {
            historyId: newHistoryId, // Use the incremented ID
            dateTime: new Date(),
            status: status, // Set the status to 'Passed' or 'Failed'
            passed: passCount,
            failed: failCount,
            failedTests: failedTests,
        };

        // Save the history entry to MongoDB
        await historyCollection.insertOne(historyEntry);

        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'Authorization header missing' });
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, 'jwt_secret');
        const username = decoded.username;

        await sendTestResultsEmail(historyEntry, username);

        if (error) {
            console.error(`Error executing test: ${error.message}`);
            return res.status(500).json({ message: 'Test execution failed', error: error.message });
        }

        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return res.status(500).json({ message: 'Test completed with errors', stderr });
        }

        console.log(`stdout: ${stdout}`);
        return res.json({ message: 'Test executed successfully', output: stdout });
    });
};

const runSelectedTest = (req, res) => {
    /*
    const { testCases, continueWithAvailable } = req.body;
    const { availableBrowsers, missingBrowsers } = checkBrowserAvailability();

    if (missingBrowsers.length > 0 && !continueWithAvailable) {
        return res.status(500).json({
            message: 'Some browsers are missing',
            missingBrowsers
        });
    }
    const browsersToUse = availableBrowsers.join(',');
    */
    const { testCases } = req.body;
    const testCaseFiles = testCases.map(testCase => `${testFolder}/${testCase}`).join(' ');
    exec(`testcafe ${browsers} ${testCaseFiles} -- concurrency 2`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing test: ${error.message}`);
            return res.status(500).json({ message: 'Test execution failed', error: error.message });
        }

        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return res.status(500).json({ message: 'Test completed with errors', stderr });
        }

        console.log(`stdout: ${stdout}`);
        return res.json({ message: 'Test executed successfully', output: stdout });
    });
};

module.exports = { runTest , runSelectedTest }; 