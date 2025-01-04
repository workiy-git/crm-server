const { CognitoUserPool, CognitoUser, CognitoUserAttribute } = require('amazon-cognito-identity-js');
const config = require('../config/config'); // Import the config module

const poolData = {
    UserPoolId: "ap-south-1_y7TfqTA4N", // Use user pool id from config
    ClientId: "2ic7i6hn5p5j3vqtk2sbhj4gg3", // Use client id from config
};

const userPool = new CognitoUserPool(poolData);

const addUserData = async (newData) => {
    try {
        if (newData.pageName === 'users') {
            console.log("Adding user data to AWS Cognito");

            const attributeList = [
                new CognitoUserAttribute({ Name: 'email', Value: newData.email }),
                new CognitoUserAttribute({ Name: 'phone_number', Value: newData.phone })
              ];

            return new Promise((resolve, reject) => {
                userPool.signUp(newData.username, 'TemporaryPassword123!', attributeList, null, (err, result) => {
                    if (err) {
                        console.error("Error creating user:", err);
                        reject(err);
                    } else {
                        console.log("User created successfully:", result);
                        resolve(result);
                    }
                });
            });
        } else {
            console.log("Not a user page, skipping Cognito user creation");
            return newData;
        }
    }
    catch (err) {
        console.log(err);
        return err;
    };
}
module.exports = { addUserData };