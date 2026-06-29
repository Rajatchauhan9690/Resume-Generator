import "./src/config/env.js";
import app from "./src/app.js";
import connectDb from "./src/config/db.js";

const PORT = process.env.PORT || 5000;
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});
connectDb();
app.listen(PORT, () => {
  console.log(`The server is running on http://localhost:${PORT}`);
});
