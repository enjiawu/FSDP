import { Selector } from 'testcafe';  
import { MongoClient } from 'mongodb';

// MongoDB configuration
const mongoUrl = 'mongodb+srv://josephbwanzj:josephwan1*@testresults.szcjd.mongodb.net/';
const dbName = 'app_test_results';
const collectionName = 'testResults';

// Function to log the main test result
async function logTestResult(t, status, errorDetails = null, startTime, endTime) {
    const client = new MongoClient(mongoUrl);

    const testResult = {
        testName: t.testRun.test.name,
        status: status, // 'Passed' or 'Failed'
        startTime: startTime,
        endTime: endTime,
        browser: {
            name: t.browser.name,
            version: t.browser.version,
            platform: t.browser.platform
        },
        errorLogs: errorDetails
    };

    const testName = t.testRun.test.name;

    try {
        // Connect to MongoDB and insert the result
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        //Existing
        // Check if a "Pending" entry exists
        const existingEntry = await collection.findOne({ testName, status: 'Pending' });

        if (existingEntry) {
            // If a "Pending" entry exists, update it
            await collection.updateOne(
                { _id: existingEntry._id }, // Use the entry's unique identifier
                {
                    $set: {
                        status: status,
                        endTime: endTime,
                        errorLogs: errorDetails,
                        browser: t ? {
                            name: t.browser.name,
                            version: t.browser.version,
                            platform: t.browser.platform
                        } : null
                    }
                }
            );
            console.log('Test result updated to database:', { testName, status });
        } else {
            const testResult = {
                testName: testName,
                status: status,  // 'Passed', 'Failed', or 'Pending'
                startTime: startTime,
                endTime: endTime,
                browser: t ? {
                    name: t.browser.name,
                    version: t.browser.version,
                    platform: t.browser.platform
                } : null,
                errorLogs: errorDetails
            };
        };
        await collection.insertOne(testResult);
        console.log('Test result saved to database:', testResult);
    } catch (error) {
        console.error('Error saving test result:', error);
    } finally {
        // Close the MongoDB connection
        await client.close();
    }
}
fixture`Customer Login` 
    .page`https://www.globalsqa.com/angularJs-protractor/BankingProject/#/login`; 

test("Login as customer", async (t) => { 
    const customerButton = Selector("button").withText("Customer Login"); 
    try { 
        await t.click(customerButton); 
        await t.click(Selector("#userSelect")); 
        await t.click(Selector("option").withText("Harry Potter")); 
        await t.click(Selector("button").withText("Login")); 
        await t.expect(Selector("strong span").innerText).eql("Harry Potter"); 
        await logTestResult(t, "Passed"); 
    } catch (error) { 
        console.error("Test failed:", error); 
        await logTestResult(t, "Failed", error.message); 
        throw error; 
    } 
}); 