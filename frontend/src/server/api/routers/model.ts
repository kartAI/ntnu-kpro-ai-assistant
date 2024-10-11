import { type Model } from "@prisma/client";
import { z } from "zod";
import { db } from "~/server/db";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const modelsRouter = createTRPCRouter({
  createModel: publicProcedure
    .input(
      z.object({
        modelName: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const res: Model = await db.model.create({
        data: {
          modelName: input.modelName,
        },
      });

      if (!res) {
        throw new Error("Failed to create model");
      }
      return res;
    }),
});
