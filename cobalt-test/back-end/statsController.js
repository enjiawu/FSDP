const { MongoClient } = require("mongodb");
const uri =
    "mongodb+srv://josephbwanzj:josephwan1*@testresults.szcjd.mongodb.net/";

const getStats = async (req, res) => {
    try {
        const client = new MongoClient(uri);
        await client.connect();

        // Access the required databases
        const testCasesDb = client.db("app_testcases");
        const testResultsDb = client.db("app_test_results");

        // Fetch test cases from the 'app_testcases' database
        const testCasesCollection = testCasesDb.collection("testCasesXYZ");
        const timeTaken = await testCasesCollection
            .find({}, { projection: { TimeTaken: 1 } })
            .toArray();

        let totalTimeTaken = 0;
        for (const time of timeTaken) {
            totalTimeTaken += time.TimeTaken;
        }

        const totalTestCases = await testCasesCollection.countDocuments();
        const average = totalTimeTaken / totalTestCases;

        // Fetch the pending test cases from the 'app_test_results' database
        const pendingTestsCollection = testResultsDb.collection("pendingTests");

        const remaining = await pendingTestsCollection.countDocuments();

        // Send the mapped test cases as the response
        res.json({ remaining: remaining, average: Number(average.toFixed(2)) });

        // Close the database connection
        await client.close();
    } catch (error) {
        console.error("Error fetching test cases:", error);
        res.status(500).send("Server error");
    }
};

module.exports = getStats;
