const express = require("express");
const { runTest, runSelectedTest } = require("./testController");
const signIn = require("./signInController");
const getTestCaseStatus = require("./testCaseStatusController");
const getTestCaseStatusByBrowser = require("./statusByBrowserController");
const getTestCases = require("./testCasesControllerv2");
const getAllTestCases = require("./alltestCasesController");
const testCaseUpdate = require("./testCaseUpdateController");
const noCodeTestCase = require("./noCodeTestCase");
const noCodeTestCaseImprovement = require("./noCodeTestCaseImprovement");
const isApplicationOwner = require("./middleware/isApplicationOwner");
const applicationController = require("./applicationController");
const getUserDetails = require("./userAccController");
const cors = require("cors");

const wss = require("./webSocketServer");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.get("/testcasestatus", getTestCaseStatus);
app.get("/statusbybrowser", getTestCaseStatusByBrowser);
app.get("/testcases", getTestCases);
app.get("/alltestcases", getAllTestCases);
app.get("/userDetails", getUserDetails);
app.get(
    "/assigned/:applicationName",
    applicationController.getUsersAssignedToApplication
);
app.post("/signin", signIn);
app.post("/run-test", runTest);
app.post("/run-selected-test", runSelectedTest);
app.post("/generatetestcase", noCodeTestCase);
app.post("/improvetestcase", noCodeTestCaseImprovement);
app.post(
    "/assign-user",
    isApplicationOwner,
    applicationController.assignUserToApplication
);
app.post(
    "/delete-user",
    isApplicationOwner,
    applicationController.deleteUserFromApplication
);

// testCaseUpdate();

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

console.log("WebSocket server is running on ws://localhost:8080");
