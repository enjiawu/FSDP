let octokit;
(async () => {
    const { Octokit } = await import('@octokit/rest');
    octokit = new Octokit({ auth: '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' });
})();

const multer = require('multer');
const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
const upload = multer({ dest: 'uploads/' });
const uri = 'mongodb+srv://josephbwanzj:josephwan1*@testresults.szcjd.mongodb.net/';

const getNextTestId = async (db) => {
    const lastTestCase = await db.collection('testCasesXYZ')
        .findOne({}, { sort: { testID: -1 } });
    return (lastTestCase?.testID || 0) + 1;
};

const uploadTestCase = async (req, res) => {
    const { testCaseName, testCaseDescription, application } = req.body;
    const fileContent = fs.readFileSync(req.file.path, 'utf8');

    const finalTestCaseName = Array.isArray(testCaseName) ? testCaseName[0] : testCaseName;

    try {
        const testCasesDir = path.join(__dirname, 'test_cases');
        const localFilePath = path.join(testCasesDir, `${finalTestCaseName}.js`);
        fs.writeFileSync(localFilePath, fileContent);
        
        console.log('Directory path:', testCasesDir);
        console.log('Full file path:', localFilePath);
        console.log('File content length:', fileContent.length);     

        // Upload to GitHub
        await octokit.repos.createOrUpdateFileContents({
            owner: 'enjiawu',
            repo: 'OCBC_Applications',
            path: `XYZBank/${finalTestCaseName}.js`,
            message: `Add test case: ${finalTestCaseName}`,
            content: Buffer.from(fileContent).toString('base64')
        });

        // Save to MongoDB
        const client = new MongoClient(uri);
        await client.connect();
        const db = client.db('app_testcases');
        
        const testCaseDocument = {
            testID: await getNextTestId(db),
            TestCase: Array.isArray(testCaseName) ? testCaseName[0] : testCaseName,
            Description: testCaseDescription,
            TimeTaken: 0.0,
            SuccessRate: 100,
            DateAdded: new Date().toISOString().split('T')[0],
            Reporter: "John Doe",
            status: "Pending",
            ExpectedOutcome: req.body.expectedOutcome,
            Purpose: req.body.purpose,
            Steps: JSON.parse(req.body.steps),
            application: application,
        };

        await db.collection('testCasesXYZ').insertOne(testCaseDocument);
        await client.close();

        // Clean up the temporary upload file
        fs.unlinkSync(req.file.path);

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = { uploadTestCase, upload };
