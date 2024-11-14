const { exec } = require('child_process');
const browsers = ['chrome', 'firefox', 'edge', 'opera']
const testFolder = '../back-end/test_cases';

const runTest = (req, res) => {
    exec(`testcafe ${browsers} ${testFolder} -- concurrently 2`, (error, stdout, stderr) => {
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
    const { testCases } = req.body;
    const testCaseFiles = testCases.map(testCase => `${testFolder}/${testCase}`).join(' ');
    exec(`testcafe ${browsers} ${testCaseFiles} -- concurrently 2`, (error, stdout, stderr) => {
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