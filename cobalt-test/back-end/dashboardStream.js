const { MongoClient } = require("mongodb");
const WebSocket = require("ws");
const uri =
    "mongodb+srv://josephbwanzj:josephwan1*@testresults.szcjd.mongodb.net/";
const client = new MongoClient(uri);

const getDashboard = async (req, res, wss) => {
    try {
        await client.connect();
        console.log("Connected to Dashboard Stream");

        const database = client.db("app_test_results");
        const collection = database.collection("testResults");

        const changeStream = collection.watch();

        changeStream.on("change", async (next) => {
            const statuses = await collection
                .aggregate([
                    {
                        $group: {
                            _id: "$status", // Grouping by the status field
                            count: { $sum: 1 }, // Counting the occurrences of each status
                        },
                    },
                ])
                .toArray();

            const totalTestCases = statuses.reduce(
                (acc, status) => acc + status.count,
                0
            );

            // Log the raw statuses from the aggregation
            console.log("Aggregated Statuses:", statuses);

            if (statuses.length === 0) {
                return res.status(200).json([]);
            }

            // Format the response as per your chart data
            const formattedStatuses = statuses.map((status) => {
                let color;
                switch (status._id) {
                    case "Passed":
                        color = "#28a745"; // Green
                        break;
                    case "Pending":
                        color = "#ffc107"; // Yellow
                        break;
                    case "Failed":
                        color = "#dc3545"; // Red
                        break;
                    default:
                        color = "#6c757d"; // Gray for unexpected statuses
                }

                const percentage = (status.count / totalTestCases) * 100;

                return {
                    name: status._id,
                    value: percentage.toFixed(2),
                    color: color,
                };
            });

            const pipeline = [
                {
                    $group: {
                        _id: { browser: "$browser.name", status: "$status" },
                        count: { $sum: 1 },
                    },
                },
                {
                    $sort: { "_id.browser": 1, "_id.status": 1 }, // Sort by browser and status
                },
            ];

            const results = await collection.aggregate(pipeline).toArray();
            const browserStatusData = {
                //chromium: [0, 0, 0],
                chrome: [0, 0, 0],
                //'chrome-canary': [0, 0, 0],
                "microsoft edge": [0, 0, 0],
                firefox: [0, 0, 0],
                opera: [0, 0, 0],
                //safari: [0, 0, 0],
            };

            // Map the results into the format we need
            results.forEach((result) => {
                const { browser, status } = result._id;
                const statusIndex =
                    status === "Passed" ? 0 : status === "Pending" ? 1 : 2;

                // If the browser exists, increment the appropriate status count
                if (browserStatusData[browser.toLowerCase()]) {
                    browserStatusData[browser.toLowerCase()][statusIndex] +=
                        result.count;
                }
            });

            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(
                        JSON.stringify({
                            overall: formattedStatuses,
                            browser: browserStatusData,
                            // testCases: mappedTestCases,
                        })
                    );
                }
            });
        });

        const pendingCollection = database.collection("pendingTests");
        const pendingStream = pendingCollection.watch();

        pendingStream.on("change", async (next) => {
            const remaining = await pendingCollection.countDocuments();

            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(
                        JSON.stringify({
                            // overall: formattedStatuses,
                            // browser: browserStatusData,
                            // testCases: mappedTestCases,
                            // average: average,
                            remaining: remaining,
                        })
                    );
                }
            });
        });

        const testCasesDb = client.db("app_testcases");

        // Fetch test cases from the 'app_testcases' database
        const testCasesCollection = testCasesDb.collection("testCasesXYZ");
        const testCasesChangeStream = testCasesCollection.watch();

        testCasesChangeStream.on("change", async (next) => {
            const testCases = await testCasesCollection.find({}).toArray();

            // Fetch the latest test case statuses from the 'app_test_results' database
            // const testResultsCollection = database.collection('testResults');

            // Aggregate to find the latest status for each testID
            const latestResults = await collection
                .aggregate([
                    { $sort: { endTime: -1 } }, // Sort by most recent timestamp
                    {
                        $group: {
                            _id: "$testID", // Group by testID
                            latestStatus: { $first: "$status" }, // Get the latest status
                            latestErrMsg: {
                                $first: { $ifNull: ["$errorLogs", "No Error"] },
                            },
                        },
                    },
                ])
                .toArray();

            // Create a map of testID to latest status for quick lookup
            const statusMap = {};
            latestResults.forEach((result) => {
                statusMap[result._id] = result.latestStatus;
            });
            const errLogMap = {};
            latestResults.forEach((result) => {
                errLogMap[result._id] = result.latestErrMsg;
            });

            // Map test cases with their respective statuses
            const mappedTestCases = testCases.map((testCase) => ({
                id: testCase.testID,
                title: testCase.TestCase,
                description: testCase.Description,
                timeTaken: testCase.TimeTaken,
                status:
                    testCase.status || statusMap[testCase.testID] || "Unknown", // Default to 'Unknown' if no status found
                errorMessage: errLogMap[testCase.testID],
            }));

            // Send the mapped test cases as the response
            // res.json(mappedTestCases);

            const timeTaken = testCases.map((testCase) => testCase.TimeTaken);

            let totalTimeTaken = 0;
            for (const time of timeTaken) {
                totalTimeTaken += time;
            }

            const totalTestCases = await testCasesCollection.countDocuments();
            const average = totalTimeTaken / totalTestCases;

            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(
                        JSON.stringify({
                            // overall: formattedStatuses,
                            // browser: browserStatusData,
                            testCases: mappedTestCases,
                            average: average,
                        })
                    );
                }
            });
        });
    } catch (error) {
        console.error("Error connecting to MongoDB: ", error);
    }
};

module.exports = getDashboard;
