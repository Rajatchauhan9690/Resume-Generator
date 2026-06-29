import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Main from "./features/interview/pages/Main";
import { Protected } from "./features/auth/component/protected";
import Interview from "./features/interview/pages/Interview";
import Landing from "./features/auth/pages/Landing";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/" element={<Landing />} />
          <Route
            path="/main"
            element={
              <Protected>
                <Main />
              </Protected>
            }
          />
          <Route
            path="/interview/:interviewId"
            element={
              <Protected>
                <Interview />
              </Protected>
            }
          />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} theme="dark" />
      </BrowserRouter>
    </>
  );
}

export default App;
