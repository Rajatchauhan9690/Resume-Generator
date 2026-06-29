import jwt from "jsonwebtoken";
import sessionModel from "../models/session.model.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const accessToken = req.cookies?.accessToken;

    if (!accessToken) {
      return res.status(401).json({
        success: false,
        message: "Access token missing",
      });
    }

    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

    const session = await sessionModel.findById(decoded.sessionId);

    if (!session) {
      return res.status(401).json({
        success: false,
        message: "Session expired",
      });
    }

    if (session.expiresAt < new Date()) {
      await session.deleteOne();

      return res.status(401).json({
        success: false,
        message: "Session expired",
      });
    }

    req.user = {
      id: decoded.id,
      sessionId: decoded.sessionId,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
};
