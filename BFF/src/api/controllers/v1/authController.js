import * as authService from "../../../services/authService.js";

export const loginUser = async (req, res, next) => {
  try {
    const { code } = req.body;
    const authResponse = await authService.loginUser(code);

    if (authResponse.refreshToken) {
      res.cookie("refreshToken", authResponse.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      delete authResponse.refreshToken;
    }

    res.status(200).json(authResponse);
  } catch (error) {
    next(error);
  }
};

export const refreshUserTokens = async (req, res, next) => {
  try {
    // Try to get refresh token from cookie first, then from request body
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
    const authResponse = await authService.refreshTokens(refreshToken);

    res.status(200).json(authResponse);
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    const accessToken = req.headers.authorization?.replace("Bearer ", "");
    // Revoke token at auth server (best effort)
    await authService.logoutUser(accessToken);

    // Clear cookies
    res.clearCookie("refreshToken");

    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

export const checkAuthStatus = (req, res, next) => {
  try {
    // If jwtParser middleware successfully added decodedToken, user is authenticated
    if (req.decodedToken) {
      return res.status(200).json({
        authenticated: true,
        user: {
          sub: req.decodedToken.sub,
          email: req.decodedToken.email,
          groups: req.decodedToken.groups || [],
        },
      });
    }

    // No valid token found
    res.status(200).json({ authenticated: false });
  } catch (error) {
    next(error);
  }
};

import {
  CognitoIdentityProviderClient,
  SignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const poolRegion = "us-east-1"; // e.g., "us-east-1"
const poolId = "us-east-1_TLeFP1P5J";
const clientId = "1o6h62vmbcs9asm04ns09e568p"; // Your Cognito App Client ID

const cognitoClient = new CognitoIdentityProviderClient({
  region: poolRegion,
});

export const signup = async (req, res) => {
  const {
    username,
    password,
    email,
    name,
    birthdate,
    gender,
    phone_number,
    address,
  } = req.body;

  // Validate input
  if (
    !username ||
    !password ||
    !email ||
    !name ||
    !birthdate ||
    !gender ||
    !phone_number ||
    !address
  ) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Prepare Cognito sign-up parameters
  const params = {
    UserPoolId: poolId,
    Username: username,
    Password: password,
    ClientId: clientId, // Add the ClientId here
    UserAttributes: [
      { Name: "email", Value: email },
      { Name: "name", Value: name },
      { Name: "birthdate", Value: birthdate },
      { Name: "gender", Value: gender },
      { Name: "phone_number", Value: phone_number },
      { Name: "address", Value: address },
    ],
    MessageAction: "SUPPRESS", // Suppress email verification (or remove this line for verification)
  };

  // Create a sign-up command
  const command = new SignUpCommand(params);

  try {
    // Execute the sign-up operation
    const result = await cognitoClient.send(command);
    return res.json({ message: "User registered successfully", result });
  } catch (error) {
    console.error("Signup error:", error);
    return res
      .status(500)
      .json({ message: "Signup failed", error: error.message });
  }
};
