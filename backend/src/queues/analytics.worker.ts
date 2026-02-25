import { Worker } from "bullmq";
import Redis from "ioredis";
import prisma from "../config/prisma";

if (process.env.NODE_ENV !== "test") {
  const connection = new Redis({
    maxRetriesPerRequest: null,
  });

  const worker = new Worker(
    "analytics",
    async () => {
      console.log("📊 Analytics job started");

      const logs = await prisma.readLog.findMany();

      const aggregation: Record<
        string,
        { articleId: string; date: Date; count: number }
      > = {};

      logs.forEach((log) => {
        const date = new Date(log.readAt);
        date.setUTCHours(0, 0, 0, 0);

        const key = `${log.articleId}-${date.toISOString()}`;

        if (!aggregation[key]) {
          aggregation[key] = {
            articleId: log.articleId,
            date,
            count: 0,
          };
        }

        aggregation[key].count++;
      });

      for (const key in aggregation) {
        const { articleId, date, count } = aggregation[key];

        await prisma.dailyAnalytics.upsert({
          where: {
            articleId_date: {
              articleId,
              date,
            },
          },
          update: {
            viewCount: count,
          },
          create: {
            articleId,
            date,
            viewCount: count,
          },
        });
      }

      console.log("✅ Analytics aggregation completed");
    },
    { connection }
  );

  worker.on("completed", () => {
    console.log("🎯 Job completed");
  });
}