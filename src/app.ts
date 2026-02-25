import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import articleRoutes from "./routes/article.routes";
import analyticsRoutes from "./routes/analytics.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  return res.status(200).json({
    Success: true,
    Message: "API is running",
    Object: null,
    Errors: null
  });
});


//  Routes

app.use("/api/auth", authRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/analytics", analyticsRoutes);

export default app;