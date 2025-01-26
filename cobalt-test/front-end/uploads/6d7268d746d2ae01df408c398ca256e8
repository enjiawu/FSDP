fixture `XYZ Bank Tests`
    .page `https://www.example.com`; // Replace with your XYZ-Bank URL


test('Successful Login', async t => {
    // Step 1: Navigate to the login page (Assuming it's the home page for this example)
    await t.expect(Selector('body').exists).ok();

    // Step 2: Locate the username field and enter the username
    await t.typeText('#username', 'validUser'); // Replace with your actual username field selector and username

    // Step 3: Locate the password field and enter the password
    await t.typeText('#password', 'validPassword'); // Replace with your actual password field selector and password

    // Step 4: Locate the login button and click it
    await t.click('#loginButton'); // Replace with your actual login button selector

    // Step 5: Verify successful login by checking for a specific element only visible after successful login
    await t.expect(Selector('#loggedInUser').exists).ok(); //Replace with a selector that is only present after successful login

});

test('Unsuccessful Login', async t => {
    // Step 1: Navigate to the login page
    await t.expect(Selector('body').exists).ok();

    // Step 2: Locate the username field and enter an invalid username
    await t.typeText('#username', 'invalidUser'); // Replace with your actual username field selector and invalid username

    // Step 3: Locate the password field and enter an invalid password
    await t.typeText('#password', 'invalidPassword');  // Replace with your actual password field selector and invalid password

    // Step 4: Locate the login button and click it
    await t.click('#loginButton'); // Replace with your actual login button selector

    // Step 5: Verify unsuccessful login by checking for an error message
    await t.expect(Selector('#errorMessage').exists).ok(); //Replace with a selector for the error message.

});

test('Account Balance Check', async t => {
    // Step 1: Log in (Assuming login is already handled in a separate test or setup)
    await t.expect(Selector('#loggedInUser').exists).ok();


    // Step 2: Navigate to the account balance page (replace with your actual navigation method)
    await t.click('#accountBalanceLink'); // Replace with your actual link selector to account balance page

    // Step 3: Verify the account balance is displayed
    await t.expect(Selector('#balance').innerText).contains('1000'); //Replace with your actual balance selector and expected balance
});