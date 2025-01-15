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
        testID: 5,
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

fixture`Customer Check Transactions` 
    .page`https://www.globalsqa.com/angularJs-protractor/BankingProject/#/login`; 

test("Check account transactions", async (t) => { 
    const customerButton = Selector("button").withText("Customer Login"); 
    const startTime = new Date();
    try { 
        await t.click(customerButton); 
        await t.click(Selector("#userSelect")); 
        await t.click(Selector("option").withText("Harry Potter")); 
        await t.click(Selector("button").withText("Login")); 
        await t.expect(Selector("strong span").innerText).eql("Harry Potter"); 
        await logTestResult(t, "Passed"); 
    
        let originalAmount = parseInt( 
            await Selector( 
                "body div div div:nth-child(2) div div:nth-child(3) strong:nth-child(2)" 
            ).innerText 
        ); 
        await t.click(Selector("button").withText("Deposit")); 
        await t.click(Selector("input")); 
        await t.typeText(Selector("input"), "500"); 
        await t.click(Selector("form button").withText("Deposit")); 
        await t 
            .expect(Selector("span[ng-show=message]").innerText) 
            .eql("Deposit Successful"); 
        await t 
            .expect( 
                parseInt( 
                    await Selector( 
                        "body div div div:nth-child(2) div div:nth-child(3) strong:nth-child(2)" 
                    ).innerText 
                ) 
            ) 
            .eql(originalAmount + 500); 
            
        await t.click(Selector("button").withText("Transactions")); 
        const endTime = new Date();
        await logTestResult(t, "Passed", null, startTime, endTime); 
    } catch (error) { 
        console.error("Test failed:", error); 
        const endTime = new Date();
        const errorDetails = {
            message: error.errMsg, 
            stack: error.callsite,   
            code: error.code
        };
        await logTestResult(t, "Failed", errorDetails, startTime, endTime); 
        throw error; 
    } 
}); 