import jwt from "jsonwebtoken";

export const generateAccessToken = (userId, sessionId) => {
  return jwt.sign(
    {
      id: userId,
      sessionId: sessionId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "15m",
    },
  );
};

export const generateRefreshToken = (userId, sessionId) => {
  return jwt.sign(
    {
      id: userId,
      sessionId: sessionId,
    },
    process.env.REFRESH_SECRET,
    {
      expiresIn: "7d",
    },
  );
};
