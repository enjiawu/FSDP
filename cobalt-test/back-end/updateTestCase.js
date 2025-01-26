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

const updateTestCase = async (req, res) => {
    const oldTestCaseName = req.body.originalTestCaseName;
    const newTestCaseName = req.body.testCaseName;
    const fileContent = fs.readFileSync(req.file.path, 'utf8');

    try {
        // Delete old files if name changed
        if (oldTestCaseName !== newTestCaseName) {
            const oldLocalPath = path.join(__dirname, 'test_cases', `${oldTestCaseName}.js`);
            if (fs.existsSync(oldLocalPath)) {
                fs.unlinkSync(oldLocalPath);
            }

            // Delete old GitHub file
            try {
                const { data } = await octokit.repos.getContent({
                    owner: 'enjiawu',
                    repo: 'OCBC_Applications',
                    path: `XYZBank/${oldTestCaseName}.js`
                });
                await octokit.repos.deleteFile({
                    owner: 'enjiawu',
                    repo: 'OCBC_Applications',
                    path: `XYZBank/${oldTestCaseName}.js`,
                    message: `Delete old test case: ${oldTestCaseName}`,
                    sha: data.sha
                });
            } catch (githubError) {
                console.log('Old GitHub file not found');
            }
        }

        // Create new files
        const newLocalPath = path.join(__dirname, 'test_cases', `${newTestCaseName}`);
        fs.writeFileSync(newLocalPath, fileContent);

        // Create new GitHub file
        try {
            let sha;
            try {
                const { data } = await octokit.repos.getContent({
                    owner: 'enjiawu',
                    repo: 'OCBC_Applications',
                    path: `XYZBank/${newTestCaseName}.js`
                });
                sha = data.sha;
            } catch (error) {
                // File doesn't exist yet, no SHA needed
            }
        
            await octokit.repos.createOrUpdateFileContents({
                owner: 'enjiawu',
                repo: 'OCBC_Applications',
                path: `XYZBank/${newTestCaseName}.js`,
                message: `Update test case: ${newTestCaseName}`,
                content: Buffer.from(fileContent).toString('base64'),
                sha: sha // Will be undefined for new files, which is fine
            });
        } catch (githubError) {
            console.log('GitHub update error:', githubError);
        }

        // Update MongoDB
        const client = new MongoClient(uri);
        await client.connect();
        const db = client.db('app_testcases');
        
        await db.collection('testCasesXYZ').updateOne(
            { TestCase: oldTestCaseName },
            {
                $set: {
                    TestCase: newTestCaseName,
                    Description: req.body.testCaseDescription
                }
            }
        );

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { updateTestCase, upload };
