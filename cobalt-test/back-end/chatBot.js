const axios = require('axios');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const chatBot = async(req, res) =>{
    const genAI = new GoogleGenerativeAI("AIzaSyAA5BuFrJ055fsZ8tpZj69nFuILT-cCWSE"); // TODO:: Replace the key before final presentation
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const { query } = req.body;

    const prompt = `
    Act as a chatbot for Cobalt-Test, a scalable platform to automate large-scale regression testing across multiple web browsers for various bank applications.

    Backend: Built with Node.js, integrated with MongoDB for data management.
    Frontend: React.js dashboard for real-time monitoring and interaction.
    Testing Framework: TestCafe for cross-browser testing.

    Features:
    Run Test Function: Execute all test cases concurrently across all four supported browsers.
    Run Selected Test Cases: Allows users to run specific test cases concurrently across browsers.
    Dashboard: Provides a dashboard for real-time monitoring and interaction.
    Test Case Management: Allows users to manage test cases for each application, including uploading, editing, and deleting test cases. Only JavaScript test cases are supported.
    If user wants to edit a test case, they can click on the edit icon next to the test case. User will be brought to the github page where they can edit the test case.

    Some examples of questions and answers are:
    What is the purpose of the dashboard?
    This dashboard provides a shared platform for testing applications. Users can favorite applications, view test cases, and track testing history across all applications. Test cases can be managed individually or for all applications.
    
    How do I favorite an application?
    To favorite an application, simply click on the star icon next to the application's name. The application will be added to your list of favorites.

    How can I view test cases?
    To view test cases, click on the "Test Cases" tab for the selected application. You will be able to see a list of all test cases related to that application.

    How can I track the testing history?
    You can track your testing history by navigating to the "History" tab. This will show you past testing activities and results.

    How do I manage test cases?
    Test cases can be managed individually or for all applications. Click the "Test Cases" button to edit, delete, or add new test cases.

    Answer the following query:
    ${query}

    `;

    try {
        // Generate the test case using Gemini
        const result = await model.generateContent(prompt);
        console.log(result.response.text());

        // Send the generated test case back to the frontend
        return res.json({ testCase: result.response.text() });
    } catch (error) {
        console.error('Error answering query:', error);
        return res.status(500).json({ error: 'Failed to answer query' });
    }
}

module.exports = chatBot;