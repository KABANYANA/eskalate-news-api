import { Worker } from "bullmq";
import IORedis from "ioredis";
import prisma from "../config/prisma";

const connection = new IORedis({
  host: "127.0.0.1",
  port: 6379,
  maxRetriesPerRequest: null
});

const worker = new Worker(
  "analytics",
  async () => {
    console.log("📊 Analytics job started");

    const reads = await prisma.readLog.findMany();

    const aggregationMap: Record<string, number> = {};

    for (const read of reads) {
      const date = new Date(read.readAt);

      const gmtDate = new Date(
        Date.UTC(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate()
        )
      );

      const key = `${read.articleId}_${gmtDate.toISOString()}`;

      aggregationMap[key] =
        (aggregationMap[key] || 0) + 1;
    }

    for (const key in aggregationMap) {
      const [articleId, date] = key.split("_");

      await prisma.dailyAnalytics.upsert({
        where: {
          articleId_date: {
            articleId,
            date: new Date(date)
          }
        },
        update: {
          viewCount: aggregationMap[key]
        },
        create: {
          articleId,
          date: new Date(date),
          viewCount: aggregationMap[key]
        }
      });
    }

    console.log("✅ Analytics aggregation completed");
  },
  { connection }
);

worker.on("completed", () => {
  console.log("🎯 Job completed");
});

worker.on("failed", (err) => {
  console.error("❌ Job failed:", err);
});