import crypto from "crypto";
import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import sessionModel from "../models/session.model.js";
import tokenBlacklistModel from "../models/tokenBlacklist.model.js";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";

/*
=================================
REGISTER
=================================
*/

const registerUserController = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields required",
      });
    }

    const existUser = await userModel.findOne({
      $or: [{ email }, { username }],
    });

    if (existUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const user = await userModel.create({
      username,
      email,
      password,
    });

    return res.status(201).json({
      success: true,
      message: "User is Registered successfully and you can login now",

      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
=================================
LOGIN
=================================
*/

const loginUserController = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    const user = await userModel.findOne({
      $or: [{ email }, { username }],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    // Create session first
    const session = await sessionModel.create({
      userId: user._id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      device: req.headers["user-agent"],
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });

    // Generate tokens using session._id
    const accessToken = generateAccessToken(user._id, session._id);

    const refreshToken = generateRefreshToken(user._id, session._id);

    // Hash refresh token
    const hashedRefreshToken = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    // Save hash in session
    session.refreshToken = hashedRefreshToken;
    await session.save();

    // Set cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
=================================
REFRESH TOKEN
=================================
*/

const refreshTokenController = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh token missing",
      });
    }

    // create hash first

    const hashedToken = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    // check blacklist

    const blacklisted = await tokenBlacklistModel.findOne({
      token: hashedToken,
    });

    if (blacklisted) {
      return res.status(401).json({
        message:
          "Token revoked successfully, please login again to get new tokens",
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    const user = await userModel.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // generate new tokens

    const session = await sessionModel.findById(decoded.sessionId);

    if (!session) {
      return res.status(401).json({
        message: "Session expired",
      });
    }
    if (session.expiresAt < new Date()) {
      await session.deleteOne();

      return res.status(401).json({
        message: "Session expired",
      });
    }

    const newAccessToken = generateAccessToken(decoded.id, session._id);

    const newRefreshToken = generateRefreshToken(decoded.id, session._id);

    if (session.refreshToken !== hashedToken) {
      return res.status(401).json({
        message: "Invalid session",
      });
    }
    // hash new refresh token

    const newHash = crypto
      .createHash("sha256")
      .update(newRefreshToken)
      .digest("hex");

    // rotate token

    session.refreshToken = newHash;

    session.lastUsed = new Date();

    await session.save();

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,

      secure: true,

      sameSite: "none",

      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,

      secure: true,

      sameSite: "none",

      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,

      message: "Token refreshed successfully",
    });
  } catch (error) {
    return res.status(401).json({
      message: "Invalid refresh token",
    });
  }
};

/*
=================================
LOGOUT CURRENT DEVICE
=================================
*/

const logoutController = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);

      const hashedToken = crypto
        .createHash("sha256")
        .update(refreshToken)
        .digest("hex");

      // Delete only the current session
      await sessionModel.findByIdAndDelete(decoded.sessionId);

      // Blacklist refresh token
      const existingToken = await tokenBlacklistModel.findOne({
        token: hashedToken,
      });

      if (!existingToken) {
        await tokenBlacklistModel.create({
          token: hashedToken,
          userId: decoded.id,
          expiresAt: new Date(decoded.exp * 1000),
        });
      }
    }
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    };
    res.clearCookie("accessToken", cookieOptions);

    res.clearCookie("refreshToken", cookieOptions);

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
=================================
LOGOUT ALL DEVICES
=================================
*/

const logoutAllController = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token missing",
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);

    // Delete all sessions of the user
    await sessionModel.deleteMany({
      userId: decoded.id,
    });

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    };

    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);

    return res.status(200).json({
      success: true,
      message: "Logged out from all devices successfully",
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid refresh token",
    });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await userModel
      .findById(req.user.id)
      .select("-password -refreshToken");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default {
  registerUserController,
  loginUserController,
  refreshTokenController,
  logoutController,
  logoutAllController,
  getUser,
};
