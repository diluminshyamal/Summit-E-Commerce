import { Buffer } from "buffer";
import * as AWS from "aws-sdk";
import * as crypto from "crypto";

export const jwtParser = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return next();
    }

    // Get token from header (removes 'Bearer ' if present)
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.substring(7)
      : authHeader;

    // Parse and decode the JWT
    const decoded = parseJwt(token);

    req.decodedToken = decoded;
    next();
  } catch (error) {
    console.error("JWT parsing error:", error);
    next();
  }
};

/**
 * Parses a JWT token and returns the decoded payload
 *
 * @param token - JWT token string to parse
 * @returns The decoded token payload as an object
 */
export function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];

    if (!base64Url) {
      throw new Error("Invalid token format");
    }

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

    const jsonPayload = Buffer.from(base64, "base64").toString("utf-8");

    return JSON.parse(jsonPayload);
  } catch (error) {
    throw new Error(`Failed to parse JWT token: ${error.message}`);
  }
}

/**
 * Calculate the secret hash required for AWS Cognito authentication
 *
 * @param clientId - The Cognito app client ID
 * @param clientSecret - The Cognito app client secret
 * @returns The calculated secret hash
 */
function calculateSecretHash(clientId, clientSecret) {
  return crypto
    .createHmac("sha256", clientSecret)
    .update(clientId)
    .digest("base64");
}

const cognito = new AWS.CognitoIdentityServiceProvider({
  region: process.env.AWS_REGION,
});

/**
 * Refresh AWS Cognito authentication tokens using a refresh token
 *
 * @param refreshToken - The refresh token from previous authentication
 * @returns Object containing new access and ID tokens
 */

export async function refreshTokens(refreshToken) {
  try {
    if (!process.env.AWS_CLIENT_ID) {
      throw new Error("AWS_CLIENT_ID is not defined in the environment.");
    }

    const secretHash = calculateSecretHash(
      process.env.AWS_CLIENT_ID,
      process.env.AWS_CLIENT_SECRET
    );

    const params = {
      AuthFlow: "REFRESH_TOKEN_AUTH",
      ClientId: process.env.AWS_CLIENT_ID,
      AuthParameters: {
        REFRESH_TOKEN: refreshToken,
        SECRET_HASH: secretHash,
      },
    };

    const authResult = await cognito.initiateAuth(params).promise();

    const newAccessToken = authResult.AuthenticationResult?.AccessToken;
    const newIdToken = authResult.AuthenticationResult?.IdToken;

    if (!newAccessToken || !newIdToken) {
      throw new Error("Token refresh response missing tokens");
    }

    return {
      accessToken: newAccessToken,
      idToken: newIdToken,
    };
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw new Error(`Unable to refresh token: ${error.message}`);
  }
}

export const autoRefreshTokenMiddleware = async (req, res, next) => {
  try {
    if (!req.decodedToken) {
      return next();
    }

    // Get token expiration time from decoded token
    const expirationTime = req.decodedToken.exp * 1000; // Convert to milliseconds
    const currentTime = Date.now();

    // Check if token expires in less than 5 minutes
    const fiveMinutesMs = 5 * 60 * 1000;
    if (expirationTime - currentTime < fiveMinutesMs) {
      // Get refresh token from cookie or header
      const refreshToken =
        req.cookies?.refreshToken || req.headers["x-refresh-token"];

      if (refreshToken) {
        const newTokens = await refreshTokens(refreshToken);

        res.setHeader("x-access-token", newTokens.accessToken);
        res.setHeader("x-id-token", newTokens.idToken);

        if (req.cookies?.refreshToken) {
          res.cookie("accessToken", newTokens.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
          });
        }
      }
    }

    next();
  } catch (error) {
    console.error("Token refresh error:", error);
    next();
  }
};
