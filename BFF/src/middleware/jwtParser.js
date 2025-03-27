import { Buffer } from "buffer";

/**
 * Middleware to parse JWT tokens from Authorization header
 * Decodes the token and attaches it to the request object
 */
export const jwtParser = (req, res, next) => {
  try {
    // Check for Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      // No token provided, continue to next middleware
      return next();
    }

    // Get token from header (removes 'Bearer ' if present)
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.substring(7)
      : authHeader;

    // Parse and decode the JWT
    const decoded = parseJwt(token);

    // Attach decoded token to request object for use in route handlers
    req.decodedToken = decoded;
    next();
  } catch (error) {
    console.error("JWT parsing error:", error);
    // Continue to next middleware even if parsing fails
    // Protected routes can check if req.decodedToken exists
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
    // JWT structure: header.payload.signature
    // Split the token and get the payload (second part)
    const base64Url = token.split(".")[1];

    if (!base64Url) {
      throw new Error("Invalid token format");
    }

    // Convert base64url to base64 by replacing characters
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

    // Decode base64 to UTF-8 string
    const jsonPayload = Buffer.from(base64, "base64").toString("utf-8");

    // Parse JSON string to object
    return JSON.parse(jsonPayload);
  } catch (error) {
    throw new Error(`Failed to parse JWT token: ${error.message}`);
  }
}