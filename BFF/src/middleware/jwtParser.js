import { Buffer } from "buffer";

export const jwtParser = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return next();
    }

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.substring(7)
      : authHeader;

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
