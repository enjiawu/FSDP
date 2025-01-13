import { Selector } from 'testcafe';   
import { MongoClient } from 'mongodb'; 

// MongoDB configuration 
const mongoUrl = 'mongodb+srv://josephbwanzj:josephwan1*@testresults.szcjd.mongodb.net/?retryWrites=true&w=majority&appName=testResults'; 
const dbName = 'app_test_results'; 
const collectionName = 'testResults'; 
 
// Function to log the main test result 
async function logTestResult(t, status, errorDetails, startTime, endTime) { 
    const client = new MongoClient(mongoUrl); 
    const testResult = { 
        testID: 7,
        testName: t.testRun.test.name, 
        status: status, // 'Passed' or 'Failed' 
        startTime: startTime, 
        endTime: endTime, 
        browser: { 
            name: t.browser.name, 
            version: t.browser.version, 
            platform: t.browser.platform 
        }, 
        errorLogs: errorDetails || null
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

fixture `Manager Open Account`   
    .page `https://www.globalsqa.com/angularJs-protractor/BankingProject/#/login` 

test('Manager Open Account', async t => {   
    const bankManagerButton = Selector('button').withText('Bank Manager Login');   
    const addCustomerButton = Selector('button').withText('Add Customer');
    const firstName = Selector('input').withAttribute('placeholder', 'First Name');
    const lastName = Selector('input').withAttribute('placeholder', 'Last Name');
    const postCode = Selector('input').withAttribute('placeholder', 'Post Code');
    const submitCustomerButton = Selector('button').withText('Add Customer').withAttribute('type', 'submit');
    const openAccountButton = Selector('button').withText('Open Account');
    const customerDropdown = Selector('select').withAttribute('id', 'userSelect');
    const customerOption = Selector('option').withText('John Doe');
    const currencyDropdown = Selector('select').withAttribute('id', 'currency');
    const currencyOption = Selector('option').withText('Dollar');
    const processButton = Selector('button').withText('Process');
    const startTime = new Date();

    await t.setNativeDialogHandler(() => true);
    try {   
        await t   
            .click(bankManagerButton)
            .click(addCustomerButton)
            .typeText(firstName, 'John')
            .typeText(lastName, 'Doe')
            .typeText(postCode, '12345')
            .click(submitCustomerButton)
            .click(openAccountButton)
            .click(customerDropdown)
            .click(customerOption)
            .click(currencyDropdown)
            .click(currencyOption)
            .click(processButton);
        
        const dialogs = await t.getNativeDialogHistory();
        console.log('Dialogs:', dialogs);
        await t.expect(dialogs[1].type).eql('alert');
        await t.expect(dialogs[1].text).contains('Customer added successfully');
        await t.expect(dialogs[0].type).eql('alert');
        await t.expect(dialogs[0].text).contains('Account created successfully');
        const endTime = new Date();
        await logTestResult(t, 'Passed', null, startTime, endTime); 

    } catch (error) {   
        console.error('Test failed:', error);   
        const endTime = new Date();
        const errorDetails = {
            message: error.errMsg, 
            stack: error.callsite,   
            code: error.code
        };
        await logTestResult(t, 'Failed', errorDetails, startTime, endTime); 
        throw error; 
    }   
}); 