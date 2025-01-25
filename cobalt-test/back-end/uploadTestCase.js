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

        let sha;
        try {
            const { data } = await octokit.repos.getContent({
                owner: 'enjiawu',
                repo: 'OCBC_Applications',
                path: `XYZBank/${finalTestCaseName}.js`
            });
            sha = data.sha;
        } catch (error) {
            // New file - no SHA needed
        }

        // Now upload with the SHA included
        await octokit.repos.createOrUpdateFileContents({
            owner: 'enjiawu',
            repo: 'OCBC_Applications',
            path: `XYZBank/${finalTestCaseName}.js`,
            message: `Add test case: ${finalTestCaseName}`,
            content: Buffer.from(fileContent).toString('base64'),
            sha: sha
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
            Reporter: Array.isArray(req.body.reporter) ? req.body.reporter[0] : req.body.reporter,
            status: "Pending",
            ExpectedOutcome: Array.isArray(req.body.expectedOutcome) ? req.body.expectedOutcome[0] :  req.body.expectedOutcome,
            Purpose: Array.isArray(req.body.purpose) ? req.body.purpose[0]:  req.body.purpose,
            Steps: JSON.parse(req.body.steps),
            application: application,
        };

        await db.collection('testCasesXYZ').insertOne(testCaseDocument);
        await client.close();

        // Clean up the temporary upload file
        fs.unlinkSync(req.file.path);

        res.json({ 
            success: true, 
            message: `Test case ${finalTestCaseName} has been uploaded successfully!`
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = { uploadTestCase, upload };
