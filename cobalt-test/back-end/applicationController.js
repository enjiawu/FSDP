const { MongoClient } = require('mongodb');

// MongoDB connection string
const uri = 'mongodb+srv://josephbwanzj:josephwan1*@testresults.szcjd.mongodb.net/';
let accountDB;
let applicationDB;

// Connect to MongoDB
MongoClient.connect(uri)
  .then(client => {
    accountDB = client.db('app_account_data');
    applicationDB = client.db('app_applications');
  })
  .catch(err => console.log('MongoDB connection error:', err));


const getUsersAssignedToApplication = async (req, res) => {
  const { applicationName } = req.params;

  if (!applicationName) {
    return res.status(400).json({ message: 'Application name is required.' });
  }

  try {
    // 1. Query the accountData collection for users with assignedApps containing the applicationID
    const users = await accountDB.collection('accountData').find({ assignedApps: applicationName }).toArray();

    if (users.length === 0) {
      return res.status(404).json({ message: 'No users found assigned to this application.' });
    }

    // 2. Return the list of users
    return res.status(200).json({ users });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

// The function to assign a user to an application
const assignUserToApplication = async (req, res) => {
  const { username, applicationName } = req.body;

  if (!username || !applicationName) {
    return res.status(400).json({ message: 'Username and application name are required.' });
  }

  try {
    // 1. Check if the application exists
    const application = await applicationDB.collection('testApplications').findOne({ name: applicationName });
    if (!application) {
      return res.status(404).json({ message: 'Application not found.' });
    }

    // 2. Get the user to be assigned to the application
    const user = await accountDB.collection('accountData').findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // 3. Check if the user is already assigned to this application
    if (user.assignedApps && user.assignedApps.includes(applicationName)) {
      return res.status(400).json({ message: 'User is already assigned to this application.' });
    }

    // 4. Add the application to the user's assignedApps field
    await accountDB.collection('accountData').updateOne(
      { username },
      { $push: { assignedApps: applicationName } }
    );

    // 5. Return success response
    return res.status(200).json({ message: `User ${username} successfully assigned to ${applicationName}.` });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

// Function to delete a user from an application
const deleteUserFromApplication = async (req, res) => {
  const { username, applicationName } = req.body;

  if (!username || !applicationName) {
    return res.status(400).json({ message: 'Username and application ID are required.' });
  }

  try {
    // 1. Check if the application exists
    const application = await applicationDB.collection('testApplications').findOne({ name: applicationName });
    if (!application) {
      return res.status(404).json({ message: 'Application not found.' });
    }

    // 2. Check if the user exists
    const user = await accountDB.collection('accountData').findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // 3. Check if the user is assigned to the application
    if (!user.assignedApps || !user.assignedApps.includes(applicationName)) {
      return res.status(400).json({ message: 'User is not assigned to this application.' });
    }

    // 4. Remove the application from the user's assignedApps field
    await accountDB.collection('accountData').updateOne(
      { username },
      { $pull: { assignedApps: applicationName } }
    );

    // 5. Return success response
    return res.status(200).json({ message: `User ${username} successfully removed from: ${applicationName}.` });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

module.exports = {
  getUsersAssignedToApplication,
  assignUserToApplication,
  deleteUserFromApplication
};
