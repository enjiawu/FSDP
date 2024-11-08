import { Selector } from 'testcafe';  

fixture `its 3am`  
    .page `https://www.globalsqa.com/angularJs-protractor/BankingProject/#/login` 

test('Login as customer test', async t => {  
    const customerButton = Selector('button').withText('Customer Login');  
    try {  
        await t  
            .click(customerButton);  
    } catch (error) {  
        console.error('Test failed:', error);  
        throw error;
    }  
}); 