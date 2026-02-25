import app from "./app";
import dotenv from "dotenv";
import "./queues/analytics.worker"; // start worker

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});