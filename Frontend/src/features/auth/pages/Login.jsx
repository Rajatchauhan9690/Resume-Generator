import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../auth.form.scss";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const { handleLogin, loading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const validationErrors = {};

    // Email/Username Validation
    if (!formData.email.trim()) {
      validationErrors.email = "Email or Username is required";
    } else if (
      formData.email.includes("@") &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      validationErrors.email = "Please enter a valid email";
    }

    // Password Validation
    if (!formData.password.trim()) {
      validationErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      validationErrors.password = "Password must be at least 6 characters";
    }

    setErrors(validationErrors);

    return Object.keys(validationErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Remove error while typing
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors before continuing.");
      return;
    }

    try {
      const loginData = {
        password: formData.password,
      };

      if (formData.email.includes("@")) {
        loginData.email = formData.email;
      } else {
        loginData.username = formData.email;
      }

      await handleLogin(loginData);

      toast.success("Login Successful 🎉");

      setFormData({
        email: "",
        password: "",
      });

      navigate("/");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Invalid email/username or password.",
      );

      console.error(error);
    }
  };

  return (
    <main>
      <div className="form-container">
        <h1>Login</h1>

        <form onSubmit={handleSubmit} noValidate>
          {/* Email / Username */}
          <div className="input-group">
            <label htmlFor="email">Email or Username</label>

            <input
              type="text"
              id="email"
              name="email"
              placeholder="Enter Email or Username"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "error-input" : ""}
            />

            {errors.email && <small className="error">{errors.email}</small>}
          </div>

          {/* Password */}
          <div className="input-group">
            <label htmlFor="password">Password</label>

            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? "error-input" : ""}
            />

            {errors.password && (
              <small className="error">{errors.password}</small>
            )}
          </div>

          <div className="button primary-button">
            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>

        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </main>
  );
};

export default Login;
