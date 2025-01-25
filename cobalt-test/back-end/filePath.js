const fs = require('fs');
const path = require('path');


const readTestScript = (req, res) => {    
    const filePath =  __dirname + '\\test_cases' + '\\' + req.params.filename;
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        res.send(content);
    } catch (error) {
        res.status(404).send('Script not found');
    }
};

module.exports = readTestScript;
