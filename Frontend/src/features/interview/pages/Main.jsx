import React, { useState, useEffect, useRef } from "react";
import "../style/main.scss";
import { useInterview } from "../hooks/useInterview.js";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
const Main = () => {
  const { loading, generateReport, reports, getReports } = useInterview();
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [pageLoading, setPageLoading] = useState(false);
  const [showReports, setShowReports] = useState(false);
  // const resumeInputRef = useRef();

  const navigate = useNavigate();
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed.");
      e.target.value = "";
      setResumeFile(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB.");
      e.target.value = "";
      setResumeFile(null);
      return;
    }

    setResumeFile(file);
  };
  const handleGenerateReport = async () => {
    console.log("Generate button clicked");
    if (!jobDescription.trim()) {
      toast.error("Job description is required.");
      return;
    }

    if (!resumeFile && !selfDescription.trim()) {
      toast.error("Please upload a resume or add your self description.");
      return;
    }

    try {
      setPageLoading(true);

      const data = await generateReport({
        jobDescription,
        selfDescription,
        resumeFile,
      });

      if (data?._id) {
        toast.success("Interview strategy generated!");

        setTimeout(() => {
          navigate(`/interview/${data._id}`);
        }, 500);
      } else {
        toast.error("Failed to generate report.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong.");
    } finally {
      setPageLoading(false);
    }
  };

  return (
    <>
      <div className={`home-page ${pageLoading ? "blur-page" : ""}`}>
        {/* Page Header */}
        <header className="page-header">
          <h1>
            Create Your Custom <span className="highlight">Interview Plan</span>
          </h1>
          <p>
            Let our AI analyze the job requirements and your unique profile to
            build a winning strategy.
          </p>
        </header>

        {/* Main Card */}
        <div className="interview-card">
          <div className="interview-card__body">
            {/* Left Panel - Job Description */}
            <div className="panel panel--left">
              <div className="panel__header">
                <span className="panel__icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                </span>
                <h2>Target Job Description</h2>
                <span className="badge badge--required">Required</span>
              </div>
              <textarea
                onChange={(e) => {
                  setJobDescription(e.target.value);
                }}
                className="panel__textarea"
                placeholder={`Paste the full job description here...\ne.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'`}
                maxLength={5000}
              />
              <div className="char-counter">
                {jobDescription.length} / 5000 chars
              </div>
            </div>

            {/* Vertical Divider */}
            <div className="panel-divider" />

            {/* Right Panel - Profile */}
            <div className="panel panel--right">
              <div className="panel__header">
                <span className="panel__icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <h2>Your Profile</h2>
              </div>

              {/* Upload Resume */}
              <div className="upload-section">
                <label className="section-label">
                  Upload Resume
                  <span className="badge badge--best">Best Results</span>
                </label>
                <label className="dropzone" htmlFor="resume">
                  <span className="dropzone__icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="16 16 12 12 8 16" />
                      <line x1="12" y1="12" x2="12" y2="21" />
                      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                    </svg>
                  </span>
                  <div>
                    <p className="dropzone__title">
                      Click to upload or drag &amp; drop
                    </p>
                    <p className="dropzone__subtitle">
                      {resumeFile
                        ? `Selected: ${resumeFile.name}`
                        : "PDF or DOCX (Max 5MB)"}
                    </p>
                  </div>
                  <input
                    hidden
                    type="file"
                    id="resume"
                    accept=".pdf,application/pdf"
                    onChange={handleFileChange}
                  />
                  {resumeFile && (
                    <div className="uploaded-file-wrapper">
                      <p className="uploaded-file">✅ {resumeFile.name}</p>

                      <button
                        type="button"
                        className="remove-file-btn"
                        onClick={() => setResumeFile(null)}
                      >
                        Remove File
                      </button>
                    </div>
                  )}
                </label>
              </div>

              {/* OR Divider */}
              <div className="or-divider">
                <span>OR</span>
              </div>

              {/* Quick Self-Description */}
              <div className="self-description">
                <label className="section-label" htmlFor="selfDescription">
                  Quick Self-Description
                </label>
                <textarea
                  onChange={(e) => {
                    setSelfDescription(e.target.value);
                  }}
                  id="selfDescription"
                  name="selfDescription"
                  className="panel__textarea panel__textarea--short"
                  placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
                />
              </div>

              {/* Info Box */}
              <div className="info-box">
                <span className="info-box__icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line
                      x1="12"
                      y1="8"
                      x2="12"
                      y2="12"
                      stroke="#1a1f27"
                      strokeWidth="2"
                    />
                    <line
                      x1="12"
                      y1="16"
                      x2="12.01"
                      y2="16"
                      stroke="#1a1f27"
                      strokeWidth="2"
                    />
                  </svg>
                </span>
                <p>
                  Either a <strong>Resume</strong> or a{" "}
                  <strong>Self Description</strong> is required to generate a
                  personalized plan.
                </p>
              </div>
            </div>
          </div>

          {/* Card Footer */}
          <div className="interview-card__footer">
            <span className="footer-info">
              AI-Powered Strategy Generation &bull; Approx 30s
            </span>
            <button
              type="button"
              onClick={handleGenerateReport}
              className="generate-btn"
              disabled={
                loading ||
                !jobDescription.trim() ||
                (!resumeFile && !selfDescription.trim())
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
              </svg>
              {/* {loading ? "Generating..." : "Generate My Interview Strategy"} */}
              {"Generate My Interview Strategy"}
            </button>
          </div>
        </div>
        <button
          className="view-reports-btn"
          onClick={async () => {
            if (!showReports) {
              await getReports();
            }

            setShowReports(!showReports);
          }}
        >
          {showReports ? "Hide My Interview Plans" : "View My Interview Plans"}
        </button>

        {/* Recent Reports List */}
        {showReports && reports.length > 0 && (
          <section className="recent-reports">
            <h2>My Recent Interview Plans</h2>

            <div className="reports-list">
              {reports.map((report) => (
                <div
                  key={report._id}
                  className="report-item"
                  onClick={() => navigate(`/interview/${report._id}`)}
                >
                  <div className="report-header">
                    <div>
                      <h3 className="report-title">
                        {report.title || "Untitled Position"}
                      </h3>

                      <p className="report-date">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div
                      className={`match-score ${
                        report.matchScore >= 80
                          ? "score--high"
                          : report.matchScore >= 60
                            ? "score--mid"
                            : "score--low"
                      }`}
                    >
                      {report.matchScore}%
                    </div>
                  </div>

                  {report.skillGaps?.length > 0 && (
                    <div className="report-skills">
                      {report.skillGaps.slice(0, 3).map((gap, index) => (
                        <span key={index} className="skill-chip">
                          {gap.skill}
                        </span>
                      ))}
                    </div>
                  )}

                  <button
                    type="button"
                    className="view-report-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/interview/${report._id}`);
                    }}
                  >
                    View Report →
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default Main;
