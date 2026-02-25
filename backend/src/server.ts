import app from "./app";
import dotenv from "dotenv";

dotenv.config();

if (process.env.NODE_ENV !== "test") {
  require("./queues/analytics.worker");
}

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});