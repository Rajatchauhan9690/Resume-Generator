import express from "express";
import interviewController from "../controllers/interview.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/file.middleware.js";
const router = express.Router();

router.post(
  "/",
  authMiddleware,
  upload.single("resume"),
  interviewController.generateInterviewReportController,
);
router.get(
  "/report/:interviewId",
  authMiddleware,
  interviewController.getInterviewReportByIdController,
);
router.get(
  "/",
  authMiddleware,
  interviewController.getAllInterviewReportsController,
);
router.post(
  "/resume/pdf/:interviewReportId",
  authMiddleware,
  interviewController.generateResumePdfController,
);
export default router;
