const { exec } = require('child_process');
const browsers = ['chrome', 'firefox', 'edge', 'opera']
const testFolder = '../back-end/test_cases';
//const checkBrowserAvailability = require('./browserController');

const runTest = (req, res) => {
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
    exec(`testcafe ${browsers} ${testFolder} -- concurrency 2`, (error, stdout, stderr) => {
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