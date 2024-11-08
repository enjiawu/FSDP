const express = require('express');
const { runTest } = require('./testController');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.post('/run-test', runTest);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});