const jwt = require('jsonwebtoken');
const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://josephbwanzj:josephwan1*@testresults.szcjd.mongodb.net/';
let db;

MongoClient.connect(uri)
  .then(client => {
    db = client.db('app_account_data');
    console.log('Connected to app_account_data database');
  })
  .catch(err => console.error('MongoDB connection error:', err));

const getUserDetails = async (req, res) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'No token provided.' });
  }
  
  try {
    const decoded = jwt.verify(token, 'jwt_secret');
    const user = await db.collection('accountData').findOne({ username: decoded.username });

    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }

    res.json({
        fullname: user.fullname || '',
        username: user.username || '',
        email: user.email || '',
    });
} catch (error) {
    console.error('Error retrieving user details:', error);
    res.status(500).json({ message: 'Failed to retrieve user details.' });
  }
};

module.exports = getUserDetails;
