import { Selector } from 'testcafe';  
import { MongoClient } from 'mongodb';

fixture `its 3am`  
    .page `https://www.globalsqa.com/angularJs-protractor/BankingProject/#/login` 


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


test('Login as customer test', async t => {   
    const startTime = new Date();
    const endTime = new Date();  // Capture end time when marking as pending
    await logTestResult(t, 'Pending', null, startTime, endTime); 

    const customerButton = Selector('button').withText('Customer Login');  
    let status = 'Passed';
    let errorDetails = null;
    try {  
        await t  
            .click(customerButton);
    } catch (error) {  
        console.error('Test failed:', error);  
        status = 'Failed';
        await logTestResult(t, status, error.message, startTime, endTime);
        throw error;
    } finally {
        const endTime = new Date();
        await logTestResult(t, status, errorDetails, startTime, endTime);
    }
}); 