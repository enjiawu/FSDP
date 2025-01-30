const axios = require('axios');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const generateReport = async (req, res) => {
    const genAI = new GoogleGenerativeAI("AIzaSyAA5BuFrJ055fsZ8tpZj69nFuILT-cCWSE"); // TODO: Replace the key before deployment
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const { } = req.body;

    const prompt = `
    Act as a report generator for Cobalt-Test, a scalable platform for automated regression testing across multiple browsers.

    Provide
    - Summary Report: A high-level overview of test execution outcomes, including total tests, pass/fail rates, and error trends.
    - Detailed Report: A comprehensive analysis of all executed tests, execution times, and root cause predictions for failures.

    Generate a report based on the following data
    1
    customerLogin.js	
    3.111
    Passed

    2
    customerDepositMoney.js	
    12.573
    Passed

    3
    customerWithdrawMoney.js	
    28.054
    Passed

    4
    customerWithdrawInsufficientFunds.js	
    10.382
    Passed

    5
    customerCheckTransactions.js	
    35.809
    Passed

    6
    managerAddCustomer.js	
    4.077
    Passed

    7
    managerOpenAccount.js	
    6.165
    Passed

    8
    managerDeleteCustomer.js
    1.849
    Passed

    Format the report with clear sections for each metric and provide actionable insights where applicable.
    `;

    try {
        // Generate the report using the AI model
        const result = await model.generateContent(prompt);
        console.log(result.response.text());

        // Send the generated report back to the frontend
        return res.json({ report: result.response.text() });
    } catch (error) {
        console.error('Error generating report:', error);
        return res.status(500).json({ error: 'Failed to generate report' });
    }
};

module.exports = generateReport;
