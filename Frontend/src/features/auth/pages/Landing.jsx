import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./landing.scss";

// Change this according to your auth context
import { useAuth } from "../hooks/useAuth";

const Landing = () => {
  const navigate = useNavigate();
  const { user, handleLogout } = useAuth();
  const onLogout = async () => {
    try {
      await handleLogout();
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="landing-page">
      {/* ================= Navbar ================= */}
      <nav className="navbar">
        <div className="navbar__logo">
          <Link to="/">AI Interview Coach</Link>
        </div>

        <div className="navbar__links">
          {!user ? (
            <>
              <Link to="/login" className="btn btn-outline">
                Login
              </Link>

              <Link to="/register" className="btn btn-primary">
                Register
              </Link>
            </>
          ) : (
            <>
              <Link to="/main" className="btn btn-primary">
                Interview
              </Link>

              <button className="btn btn-outline" onClick={onLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      </nav>

      {/* ================= Hero ================= */}

      <section className="hero">
        <div className="hero__content">
          <span className="hero__badge">
            🚀 AI Powered Interview Preparation
          </span>

          <h1>
            Ace Your Next <span>Technical Interview</span> with AI
          </h1>

          <p>
            Upload your resume, paste the job description and receive
            personalized interview questions, ATS analysis, match score,
            strengths, weaknesses and a complete interview roadmap.
          </p>

          <div className="hero__buttons">
            {!user ? (
              <>
                <Link to="/register" className="btn btn-primary btn-lg">
                  Get Started
                </Link>

                <Link to="/login" className="btn btn-outline btn-lg">
                  Login
                </Link>
              </>
            ) : (
              <Link to="/main" className="btn btn-primary btn-lg">
                Start Interview
              </Link>
            )}
          </div>

          <div className="hero__stats">
            <div className="stat">
              <h3>1000+</h3>
              <p>Reports Generated</p>
            </div>

            <div className="stat">
              <h3>95%</h3>
              <p>ATS Accuracy</p>
            </div>

            <div className="stat">
              <h3>24/7</h3>
              <p>AI Assistance</p>
            </div>
          </div>
        </div>

        <div className="hero__image">
          <div className="preview-card">
            <h3>Interview Report</h3>

            <div className="score">
              <span>Match Score</span>
              <strong>89%</strong>
            </div>

            <ul>
              <li>✅ React Questions</li>
              <li>✅ JavaScript Questions</li>
              <li>✅ HR Questions</li>
              <li>✅ Improvement Roadmap</li>
              <li>✅ ATS Resume Review</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ================= Features ================= */}

      <section className="features">
        <h2>Everything You Need To Crack Interviews</h2>

        <div className="features__grid">
          <div className="feature-card">
            <h3>📄 Resume Analysis</h3>
            <p>
              AI analyzes your resume and identifies strengths and weaknesses.
            </p>
          </div>

          <div className="feature-card">
            <h3>🎯 ATS Match Score</h3>
            <p>Compare your resume with the job description instantly.</p>
          </div>

          <div className="feature-card">
            <h3>💻 Technical Questions</h3>
            <p>Practice role-specific technical interview questions.</p>
          </div>

          <div className="feature-card">
            <h3>💬 HR Questions</h3>
            <p>Prepare for behavioral and HR interviews with AI.</p>
          </div>

          <div className="feature-card">
            <h3>📈 Skill Gap Analysis</h3>
            <p>Discover missing skills required for your target job.</p>
          </div>

          <div className="feature-card">
            <h3>🚀 Personalized Roadmap</h3>
            <p>Receive a complete preparation strategy in seconds.</p>
          </div>
        </div>
      </section>
      {/* ================= How It Works ================= */}

      <section className="how-it-works">
        <div className="container">
          <h2>How It Works</h2>
          <p>Prepare for your interview in just a few simple steps.</p>

          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Login</h3>
              <p>
                Create an account or login to access your interview dashboard.
              </p>
            </div>

            <div className="step">
              <div className="step-number">2</div>
              <h3>Upload Resume</h3>
              <p>
                Upload your latest resume or provide a short self-description.
              </p>
            </div>

            <div className="step">
              <div className="step-number">3</div>
              <h3>Paste Job Description</h3>
              <p>Add the target job description for AI analysis.</p>
            </div>

            <div className="step">
              <div className="step-number">4</div>
              <h3>Generate Report</h3>
              <p>
                Receive personalized interview questions, ATS score and roadmap.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}

      <section className="cta">
        <div className="cta-card">
          <h2>Ready to Land Your Dream Job?</h2>

          <p>
            Let AI prepare you for your next interview with personalized
            questions, resume analysis and an interview strategy.
          </p>

          {!user ? (
            <Link to="/register" className="btn btn-primary btn-lg">
              Get Started Now
            </Link>
          ) : (
            <Link to="/interview" className="btn btn-primary btn-lg">
              Go To Interview
            </Link>
          )}
        </div>
      </section>

      {/* ================= Footer ================= */}

      <footer className="footer">
        <div className="footer-grid">
          <div>
            <h3>AI Interview Coach</h3>
            <p>
              Your AI-powered platform for interview preparation, resume
              analysis and career growth.
            </p>
          </div>

          <div>
            <h4>Quick Links</h4>

            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>

              {!user && (
                <>
                  <li>
                    <Link to="/login">Login</Link>
                  </li>

                  <li>
                    <Link to="/register">Register</Link>
                  </li>
                </>
              )}

              {user && (
                <li>
                  <Link to="/main">Interview</Link>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h4>Resources</h4>

            <ul>
              <li>
                <a href="#">Privacy Policy</a>
              </li>

              <li>
                <a href="#">Terms of Service</a>
              </li>

              <li>
                <a href="#">Support</a>
              </li>
            </ul>
          </div>

          <div>
            <h4>Contact</h4>

            <p>📧 support@aiinterview.com</p>
            <p>🌐 AI Interview Coach</p>
          </div>
        </div>

        <div className="footer-bottom">
          © 2026 AI Interview Coach. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};

export default Landing;
