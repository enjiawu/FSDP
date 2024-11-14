const express = require('express');
const { runTest } = require('./testController');
const signIn = require('./signInController');
const getTestCaseStatus = require('./testCaseStatusController');
const getTestCaseStatusByBrowser = require('./statusByBrowserController');
const getTestCases = require('./testCasesController');
const getAllTestCases = require('./alltestCasesController')
const testCaseUpdate = require('./testCaseUpdateController');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.get('/testcasestatus', getTestCaseStatus);
app.get('/statusbybrowser', getTestCaseStatusByBrowser);
app.get('/testcases', getTestCases);
app.get('/alltestcases', getAllTestCases);
app.post('/signin', signIn);
app.post('/run-test', runTest);

testCaseUpdate();

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});