import axios from "axios";

// const API_URL = "http://localhost:3000";
const API_URL = "https://resume-generator-d1hp.onrender.com";
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});
export const register = async (userData) => {
  const { data } = await api.post("/api/auth/register", userData);
  return data;
};

export const login = async (userData) => {
  const { data } = await api.post("/api/auth/login", userData);
  return data;
};

export const logout = async () => {
  const { data } = await api.post("/api/auth/logout");
  return data;
};

export const logoutAll = async () => {
  const { data } = await api.post("/api/auth/logoutall");
  return data;
};

export const getUser = async () => {
  const { data } = await api.get("/api/auth/get-me");
  return data;
};

export const generateInterviewReport = async ({
  jobDescription,
  selfDescription,
  resumeFile,
}) => {
  const formData = new FormData();
  formData.append("jobDescription", jobDescription);
  formData.append("selfDescription", selfDescription);
  formData.append("resume", resumeFile);

  const response = await api.post("/api/interview/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const getInterviewReportById = async (interviewId) => {
  const response = await api.get(`/api/interview/report/${interviewId}`);

  return response.data;
};

export const getAllInterviewReports = async () => {
  const response = await api.get("/api/interview/");

  return response.data;
};

export const generateResumePdf = async ({ interviewReportId }) => {
  const response = await api.post(
    `/api/interview/resume/pdf/${interviewReportId}`,
    null,
    {
      responseType: "blob",
    },
  );

  return response.data;
};
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const user = localStorage.getItem("user");

    if (
      user &&
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/api/auth/refresh-token"
    ) {
      originalRequest._retry = true;

      try {
        await api.post("/api/auth/refresh-token");

        return api(originalRequest);
      } catch (err) {
        localStorage.removeItem("user");

        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }

        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
