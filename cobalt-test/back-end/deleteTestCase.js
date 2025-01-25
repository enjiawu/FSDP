let octokit;
(async () => {
    const { Octokit } = await import('@octokit/rest');
    octokit = new Octokit({ auth: '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' });
})();

const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
const uri = 'mongodb+srv://josephbwanzj:josephwan1*@testresults.szcjd.mongodb.net/';

const deleteTestCase = async (req, res) => {
    const testCaseName = req.params.filename;
    
    try {
        // Delete from GitHub
        let sha;
        try {
            const { data } = await octokit.repos.getContent({
                owner: 'enjiawu',
                repo: 'OCBC_Applications',
                path: `XYZBank/${testCaseName}.js`
            });
            sha = data.sha;

            await octokit.repos.deleteFile({
                owner: 'enjiawu',
                repo: 'OCBC_Applications',
                path: `XYZBank/${testCaseName}.js`,
                message: `Delete test case: ${testCaseName}`,
                sha: sha
            });
        } catch (error) {
            console.log('GitHub file not found, continuing...');
        }

        // Delete from MongoDB
        const client = new MongoClient(uri);
        await client.connect();
        const db = client.db('app_testcases');
        await db.collection('testCasesXYZ').deleteOne({ TestCase: testCaseName });
        await client.close();

        // Try to delete local file, but continue if not found
        try {
            const localFilePath = path.join(__dirname, 'test_cases', `${testCaseName}.js`);
            if (fs.existsSync(localFilePath)) {
                fs.unlinkSync(localFilePath);
            }
        } catch (error) {
            console.log('Local file not found, continuing...');
        }

        res.json({
            success: true,
            message: `Test case ${testCaseName} has been deleted successfully!`
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = { deleteTestCase };
