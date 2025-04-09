// import axios from "axios";
// import querystring from "querystring";
// import logger from "../shared/loggerUtils.js";
// import { parseJwt } from "../middleware/jwtParser.js";

// /**
//  * Login user with authorization code from OAuth flow
//  *
//  * @param {string} code - Authorization code from OAuth provider
//  * @returns {Promise<AuthResponse>} Authentication response with tokens and user info
//  */
// export const loginUser = async (code) => {
//   try {
//     // Create Basic Auth header from client credentials
//     const basicAuth = Buffer.from(
//       `${process.env.AWS_CLIENT_ID}:${process.env.AWS_CLIENT_SECRET}`
//     ).toString("base64");

//     // Exchange code for tokens
//     const response = await axios.post(
//       process.env.TOKEN_ENDPOINT,
//       querystring.stringify({
//         grant_type: "authorization_code",
//         code,
//         redirect_uri: process.env.REDIRECT_URI,
//       }),
//       {
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded",
//           Authorization: `Basic ${basicAuth}`,
//         },
//       }
//     );

//     // Extract tokens from response
//     const { access_token, id_token, refresh_token } = response.data;

//     // Decode tokens to get expiration times and user info
//     const decodedAccessToken = parseJwt(access_token);
//     const decodedIdToken = parseJwt(id_token);

//     // Return tokens and parsed information
//     return {
//       accessToken: access_token,
//       idToken: id_token,
//       refreshToken: refresh_token,
//       accessTokenExp: decodedAccessToken.exp,
//       idTokenExp: decodedIdToken.exp,
//       user: {
//         sub: decodedIdToken.sub,
//         email: decodedIdToken.email || "",
//         name: decodedIdToken.name,
//         groups: decodedIdToken.groups || [],
//       },
//     };
//   } catch (error) {
//     logger.error(
//       `Authentication error ${(error.message, error.response?.data)}`
//     );
//   }
// };

// /**
//  * Refresh tokens using a refresh token
//  *
//  * @param {string} refreshToken - Valid refresh token
//  * @returns {Promise<AuthResponse>} Authentication response with new tokens
//  */
// export const refreshTokens = async (refreshToken) => {
//   try {
//     // Create Basic Auth header from client credentials
//     const basicAuth = Buffer.from(
//       `${process.env.AWS_CLIENT_ID}:${process.env.AWS_CLIENT_SECRET}`
//     ).toString("base64");

//     // Request new tokens using refresh token
//     const response = await axios.post(
//       process.env.TOKEN_ENDPOINT,
//       querystring.stringify({
//         grant_type: "refresh_token",
//         refresh_token: refreshToken,
//       }),
//       {
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded",
//           Authorization: `Basic ${basicAuth}`,
//         },
//       }
//     );

//     // Extract new tokens
//     const { access_token, id_token } = response.data;

//     // Decode tokens to get expiration times
//     const decodedAccessToken = parseJwt(access_token);
//     const decodedIdToken = parseJwt(id_token);

//     // Return new tokens
//     return {
//       accessToken: access_token,
//       idToken: id_token,
//       accessTokenExp: decodedAccessToken.exp,
//       idTokenExp: decodedIdToken.exp,
//       user: {
//         sub: decodedIdToken.sub,
//         email: decodedIdToken.email || "",
//         name: decodedIdToken.name,
//         groups: decodedIdToken.groups || [],
//       },
//     };
//   } catch (error) {
//     logger.error(
//       `Token refresh error", ${(error.message, error.response?.data)}`
//     );
//   }
// };

// /**
//  * Logout user by revoking tokens and invalidating session
//  *
//  * @param {string} accessToken - User's access token to revoke
//  */
// export const logoutUser = async (accessToken) => {
//   try {
//     if (!accessToken) {
//       return;
//     }

//     // Optional: Revoke token at the auth server if supported by your provider
//     await axios.post(
//       process.env.REVOCATION_ENDPOINT,
//       querystring.stringify({
//         token: accessToken,
//         token_type_hint: "access_token",
//         client_id: process.env.AWS_CLIENT_ID,
//       }),
//       {
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded",
//         },
//       }
//     );
//   } catch (error) {
//     logger.error(`Logout error", ${error.message}`);
//   }
// };

import jwt from "jsonwebtoken";
import {
  CognitoIdentityProviderClient,
  SignUpCommand,
  InitiateAuthCommand,
  GetUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import logger from "../shared/loggerUtils.js";

import userService from "./userService.js";

const cognitoClient = new CognitoIdentityProviderClient({
  region: "us-east-1",
});

const CLIENT_ID = "1o6h62vmbcs9asm04ns09e568p";
const JWT_SECRET = "HI";

const signUp = async (
  username,
  password,
  email,
  phone_number,
  name,
  address,
  birthdate,
  gender,
  role
) => {
  const params = {
    ClientId: CLIENT_ID,
    Username: username,
    Password: password,
    UserAttributes: [
      { Name: "email", Value: email },
      { Name: "phone_number", Value: phone_number },
      { Name: "name", Value: name },
      { Name: "address", Value: address },
      { Name: "birthdate", Value: birthdate },
      { Name: "gender", Value: gender },
      { Name: "custom:role", Value: role },
    ],
  };

  try {
    const command = new SignUpCommand(params);
    const data = await cognitoClient.send(command);
    const res = await userService.createUser(username);

    return { awsUser: data, user: res?.data };
  } catch (error) {
    throw new Error(`SignUp failed: ${error.message}`);
  }
};

const signIn = async (username, password) => {
  const params = {
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: CLIENT_ID,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
      // SECRET_HASH: calculateSecretHash(username),
    },
  };

  try {
    // First, authenticate the user
    const command = new InitiateAuthCommand(params);
    const data = await cognitoClient.send(command);

    const userInfo = await userService.getIdbyUsername(username);

    // After successful authentication, fetch the user's attributes using the AccessToken
    const getUserCommand = new GetUserCommand({
      AccessToken: data.AuthenticationResult.AccessToken,
    });
    const userAttributes = await cognitoClient.send(getUserCommand);

    // You can access user attributes from userAttributes.UserAttributes
    const userData = userAttributes.UserAttributes.reduce((acc, attribute) => {
      acc[attribute.Name] = attribute.Value;
      return acc;
    }, {});

    // Create a JWT token with the user attributes and access token
    const token = jwt.sign(
      {
        accessToken: data.AuthenticationResult.AccessToken,
        user: userData, // Include the user attributes
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return {
      token: token,
      user: userData, // Return the user attributes here
      id: userInfo,
    };
  } catch (error) {
    throw new Error(`SignIn failed: ${error.message}`);
  }
};

const getCurrentUser = async (req) => {
  const currentUser = req.user;

  try {
    const command = new GetUserCommand({
      AccessToken: currentUser.accessToken,
    });
    const userData = await cognitoClient.send(command);

    return {
      cognitoUser: userData,
      user: currentUser.user,
    };
  } catch (error) {
    throw new Error(`Get User failed: ${error.message}`);
  }
};

const authService = {
  signUp,
  signIn,
  getCurrentUser,
};

export default authService;
