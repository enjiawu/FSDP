import { Selector } from 'testcafe';   
import { MongoClient } from 'mongodb'; 

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

fixture `Manager Add Customer`   
    .page `https://www.globalsqa.com/angularJs-protractor/BankingProject/#/login` 

test('Manager Add Customer', async t => {   
    const bankManagerButton = Selector('button').withText('Bank Manager Login');   
    const addCustomerButton = Selector('button').withText('Add Customer');
    const firstName = Selector('input').withAttribute('placeholder', 'First Name');
    const lastName = Selector('input').withAttribute('placeholder', 'Last Name');
    const postCode = Selector('input').withAttribute('placeholder', 'Post Code');
    const submitCustomerButton = Selector('button').withText('Add Customer').withAttribute('type', 'submit');
    
    await t.setNativeDialogHandler(() => true);
    try {   
        await t   
            .click(bankManagerButton)
            .click(addCustomerButton)
            .typeText(firstName, 'John')
            .typeText(lastName, 'Doe')
            .typeText(postCode, '12345')
            .click(submitCustomerButton);
        
        const dialogs = await t.getNativeDialogHistory();
        await t.expect(dialogs[0].type).eql('alert');
        await t.expect(dialogs[0].text).contains('Customer added successfully');
        await logTestResult(t, 'Passed'); 

    } catch (error) {   
        console.error('Test failed:', error);   
        await logTestResult(t, 'Failed', error.message); 
        throw error; 
    }   
}); 