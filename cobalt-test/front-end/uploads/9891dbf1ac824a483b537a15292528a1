fixture `My Fixture`
    .page `https://example.com`; //This sets the base URL for the tests in this fixture


test('d', async t => {
    // Step 1: Navigate to a specific page (replace with your actual page URL)
    await t.navigateTo('/some/page'); 

    // Step 2:  Verify that the page title matches the expected title
    await t.expect(Selector('title').innerText).eql('Expected Page Title');

    //Step 3: Assert that a specific element is visible on the page
    await t.expect(Selector('#myElement').visible).ok();

    // Step 4: Interact with an element (e.g., click a button)
    await t.click('#myButton'); 

    // Step 5: Verify that an element appears after clicking the button
    await t.expect(Selector('#elementAfterClick').exists).ok();

    // Step 6: Input text into a text field
    await t.typeText('#myTextField', 'Some Text');

    //Step 7: Verify the text entered in the text field
    await t.expect(Selector('#myTextField').value).eql('Some Text');
});