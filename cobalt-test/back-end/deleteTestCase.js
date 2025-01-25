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
    const testCaseName = req.params.name;
    const id = parseInt(req.params.id);
    
    try {
        // Delete from GitHub
        let sha;
        try {
            const { data } = await octokit.repos.getContent({
                owner: 'enjiawu',
                repo: 'OCBC_Applications',
                path: `XYZBank/${testCaseName}`
            });
            sha = data.sha;

            await octokit.repos.deleteFile({
                owner: 'enjiawu',
                repo: 'OCBC_Applications',
                path: `XYZBank/${testCaseName}`,
                message: `Delete test case: ${testCaseName}`,
                sha: sha
            });
        } catch (error) {
            console.log('GitHub file not found, continuing...');
        }

        // Delete from MongoDB
        const client = new MongoClient(uri);
        try {
            await client.connect();
            const db = client.db('app_testcases');
            const result = await db.collection('testCasesXYZ').deleteOne({ testID: id });
            
            console.log('MongoDB deletion result:', result);
            if (result.deletedCount === 0) {
                throw new Error(`No test case found with id: ${id}`);
            }
            
            console.log(`Successfully deleted test case: ${id}`);
        } catch (error) {
            console.error('MongoDB deletion error:', error);
            throw error; // Propagate error up
        } finally {
            await client.close();
        }

        // Try to delete local file, but continue if not found
        try {
            const localFilePath = path.join(__dirname, 'test_cases', `${testCaseName}`);
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
