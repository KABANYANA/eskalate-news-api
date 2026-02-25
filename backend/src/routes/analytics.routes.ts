import { Router } from "express";
import { analyticsQueue } from "../queues/analytics.queue";

const router = Router();

router.post("/run", async (_req, res) => {
  try {
    if (!analyticsQueue) {
      return res.status(503).json({
        Success: false,
        Message: "Analytics queue not available",
        Object: null,
        Errors: ["Queue is disabled in test environment"],
      });
    }

    await analyticsQueue.add("aggregate-daily-reads", {});

    return res.json({
      Success: true,
      Message: "Analytics job queued",
      Object: null,
      Errors: null,
    });
  } catch (error) {
    return res.status(500).json({
      Success: false,
      Message: "Failed to queue analytics job",
      Object: null,
      Errors: ["Internal server error"],
    });
  }
});

export default router;