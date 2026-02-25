import { Router } from "express";
import { analyticsQueue } from "../queues/analytics.queue";

const router = Router();

router.post("/run", async (_req, res) => {
  await analyticsQueue.add("aggregate-daily-reads", {});

  return res.json({
    Success: true,
    Message: "Analytics job queued",
    Object: null,
    Errors: null
  });
});

export default router;