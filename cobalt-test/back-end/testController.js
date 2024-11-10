const { exec } = require('child_process');

const runTest = (req, res) => {
    const testFolder = '../back-end/test_cases';
    const browsers = ['chrome', 'firefox', 'edge', 'opera']
    exec(`testcafe ${browsers} ${testFolder}`, (error, stdout, stderr) => {
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

module.exports = { runTest };