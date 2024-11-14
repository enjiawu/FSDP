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

fixture`Customer Withdraw Money` 
    .page`https://www.globalsqa.com/angularJs-protractor/BankingProject/#/login`; 
    
test("Withdraw money from account", async (t) => { 
    const customerButton = Selector("button").withText("Customer Login"); 
    try { 
        await t.click(customerButton); 
        await t.click(Selector("#userSelect")); 
        await t.click(Selector("option").withText("Harry Potter")); 
        await t.click(Selector("button").withText("Login")); 
        await t.expect(Selector("strong span").innerText).eql("Harry Potter"); 
    
        let originalAmount = parseInt( 
            Selector( 
                "body div div div:nth-child(2) div div:nth-child(3) strong:nth-child(2)" 
            ).innerText 
        ); 
        await t.click(Selector("button").withText("Deposit")); 
        await t.click(Selector("input")); 
        await t.typeText(Selector("input"), "500"); 
        await t.click(Selector("form button").withText("Deposit")); 
        await t.expect(Selector("span[ng-show=message]").exists).ok(); 
        await t.click(Selector("button").withText("Withdrawl")); 
        await t.click(Selector("input")); 
        await t.typeText(Selector("input"), "100"); 
        await t.click(Selector("form button").withText("Withdraw")); 
        await t 
            .expect(Selector("span[ng-show=message]").innerText) 
            .eql("Transaction successful"); 
        await t 
            .expect( 
                parseInt( 
                    Selector( 
                        "body div div div:nth-child(2) div div:nth-child(3) strong:nth-child(2)" 
                    ).innerText 
                ) 
            ) 
            .eql(originalAmount - 100); 
        await logTestResult(t, "Passed"); 
    } catch (error) { 
        console.error("Test failed:", error); 
        await logTestResult(t, "Failed", error.message); 
        throw error; 
    } 
}); 