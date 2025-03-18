const { CognitoUserPool, CognitoUser, AuthenticationDetails } = require('amazon-cognito-identity-js');
const config = require('../config/config'); // Import the config module

const poolData = {
    UserPoolId: "ap-south-1_y7TfqTA4N", // Use user pool id from config
    ClientId: "2ic7i6hn5p5j3vqtk2sbhj4gg3", // Use client id from config
};
const createLoginData = (req, res) => {
  // Implementation for creating login data
};

const getLoginData = (req, res) => {
  // Implementation for getting a single login data by ID
};

const updateLoginData = (req, res) => {
  // Implementation for updating login data by ID
};

const deleteLoginData = (req, res) => {
  // Implementation for deleting login data by ID
};

const getAllLoginData = (req, res) => {
  // Implementation for getting all login data
};

const userPool = new CognitoUserPool(poolData);

const login = (req, res) => {
    const { username, password, newPassword } = req.body;

    const authenticationDetails = new AuthenticationDetails({
        Username: username,
        Password: password,
    });

    const userData = {
        Username: username,
        Pool: userPool,
    };

    const cognitoUser = new CognitoUser(userData);

    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
            res.send('Login successful');
        },
        onFailure: (err) => {
            res.status(400).send(err.message || JSON.stringify(err));
        },
        newPasswordRequired: (userAttributes, requiredAttributes) => {
            // User needs to set a new password
            delete userAttributes.email_verified; // Remove email_verified attribute if present
            cognitoUser.completeNewPasswordChallenge(newPassword, userAttributes, {
                onSuccess: (result) => {
                    res.send('Password changed successfully');
                },
                onFailure: (err) => {
                    res.status(400).send(err.message || JSON.stringify(err));
                },
            });
        },
    });
};

module.exports = { 
  createLoginData,
  getLoginData,
  updateLoginData,
  deleteLoginData,
  getAllLoginData };