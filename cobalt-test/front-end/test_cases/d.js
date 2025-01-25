import { Selector } from 'testcafe';

fixture `Login`
    .page `https://www.xyz-bank.com/`; // Replace with your actual login page URL


test('Successful Login', async t => {
    // Step 1: Open the application login page.  (This is handled by the fixture's .page setting)

    // Step 2: Verify that the login page loads successfully and displays fields for username and password.
    await t.expect(Selector('#username').exists).ok('Username field not found');
    await t.expect(Selector('#password').exists).ok('Password field not found');

    // Step 3: Enter a valid username in the username field and ensure it is accepted.
    await t.typeText('#username', 'validuser'); // Replace 'validuser' with a valid username

    // Step 4: Enter a valid password in the password field and ensure it is accepted, with the input masked.
    await t.typeText('#password', 'validpassword'); // Replace 'validpassword' with a valid password
    await t.expect(Selector('#password').value).eql('********', 'Password not masked'); // Assertion for password masking


    // Step 5: Click the "Login" button.
    await t.click('#login'); // Replace '#login' with the actual selector for the login button


    // Step 6: Verify that the entered credentials are checked against the database. (Implicitly checked by successful redirection)

    // Step 7: If the credentials match an existing account, ensure the user is redirected to the home page.
    await t.expect(Selector('#someHomePageElement').exists).ok('Not redirected to home page'); // Replace '#someHomePageElement' with a selector specific to your home page


});

test('Unsuccessful Login', async t => {
    // Step 1: Open the application login page. (This is handled by the fixture's .page setting)

    // Step 2: Verify that the login page loads successfully and displays fields for username and password.
    await t.expect(Selector('#username').exists).ok('Username field not found');
    await t.expect(Selector('#password').exists).ok('Password field not found');

    // Step 3: Enter an invalid username in the username field.
    await t.typeText('#username', 'invaliduser');

    // Step 4: Enter an invalid password in the password field.
    await t.typeText('#password', 'wrongpassword');

    // Step 5: Click the "Login" button.
    await t.click('#login');

    // Step 6 & 7: Verify that an error message is displayed.
    await t.expect(Selector('.error-message').exists).ok('Error message not displayed'); // Replace '.error-message' with the actual selector for the error message
    // Add assertion to check the text of the error message if needed.  For example:
    // await t.expect(Selector('.error-message').textContent).contains('Invalid username or password');

});