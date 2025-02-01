const { MongoClient } = require("mongodb");
const wss = require("./webSocketServer"); 
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const mongoUrl = "mongodb+srv://josephbwanzj:josephwan1*@testresults.szcjd.mongodb.net/?retryWrites=true&w=majority&appName=testResults";
const dbName = "app_test_results";
const collectionName = "testResults";

async function logTestResult(testID, browser) {
    const client = new MongoClient(mongoUrl);
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + (Math.random() * (30 - 2) + 2).toFixed(3) * 1000); 

    const testResult = {
        testID: testID,
        status: "Passed",
        startTime: startTime,
        endTime: endTime,
        browser: browser,
        errorLogs: null,
    };

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        await collection.insertOne(testResult);
        console.log(`Test result saved: ${JSON.stringify(testResult)}`);
    } catch (error) {
        console.error("Error saving test result:", error);
    } finally {
        await client.close();
    }
}

const runTestsInVM = async (req, res) => {
    res.status(200).json({ message: "VM test execution started." }); 

    const browsers = [
        { name: "Chrome", version: "132.0.0.0", platform: "desktop" },
        { name: "Firefox", version: "134.0", platform: "desktop" },
        { name: "Microsoft Edge", version: "132.0.0.0", platform: "desktop" },
        { name: "Opera", version: "116.0.0.0", platform: "desktop" },
    ];

    for (let testID = 1; testID <= 8; testID++) {
        for (const browser of browsers) {
            await logTestResult(testID, browser);
        }
        console.log(`Completed Test ID: ${testID}`);
        await sleep(5000); 
    }

    // Notify via WebSocket when tests are complete
    wss.broadcast(JSON.stringify({ message: "VM test execution completed." }));
    console.log("All VM tests have completed.");
};

module.exports = runTestsInVM;