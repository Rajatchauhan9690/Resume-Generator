import { createRoot } from "react-dom/client";
import "./style.scss";
import App from "./App.jsx";
import { AuthProvider } from "./features/auth/auth.context";
import { InterviewProvider } from "./features/interview/interview.context";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <InterviewProvider>
      <App />
    </InterviewProvider>
  </AuthProvider>,
);
