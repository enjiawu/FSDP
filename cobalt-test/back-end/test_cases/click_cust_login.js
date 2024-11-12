import { Selector } from 'testcafe';  
import { MongoClient } from 'mongodb';

fixture `its 3am`  
    .page `https://www.globalsqa.com/angularJs-protractor/BankingProject/#/login` 


// MongoDB configuration
const mongoUrl = 'mongodb+srv://josephbwanzj:josephwan1*@testresults.szcjd.mongodb.net/?retryWrites=true&w=majority&appName=testResults';
const dbName = 'app_test_results';
const collectionName = 'testResults';

// Function to log the main test result
async function logTestResult(t, status, errorDetails = null) {
    const client = new MongoClient(mongoUrl);

    const testResult = {
        testName: t.testRun.test.name,
        status: status, // 'Passed' or 'Failed'
        startTime: new Date(),
        endTime: new Date(),
        browser: {
            name: t.browser.name,
            version: t.browser.version,
            platform: t.browser.platform
        },
        errorLogs: errorDetails
    };

    try {
        // Connect to MongoDB and insert the result
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
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
    const customerButton = Selector('button').withText('Customer Login');  
    try {  
        await t  
            .click(customerButton);  
        await logTestResult(t, 'Passed');
    } catch (error) {  
        console.error('Test failed:', error);  
        await logTestResult(t, 'Failed', error.message);
        throw error;
    }  
}); 