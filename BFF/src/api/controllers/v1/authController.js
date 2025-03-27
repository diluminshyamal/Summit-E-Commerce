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
