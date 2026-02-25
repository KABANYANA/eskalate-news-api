import { Queue } from "bullmq";
import Redis from "ioredis";

let analyticsQueue: Queue | null = null;

if (process.env.NODE_ENV !== "test") {
  const connection = new Redis({
    maxRetriesPerRequest: null,
  });

  analyticsQueue = new Queue("analytics", {
    connection,
  });
}

export { analyticsQueue };