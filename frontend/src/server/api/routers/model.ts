import { type Model } from "@prisma/client";
import { z } from "zod";
import { db } from "~/server/db";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const modelRouter = createTRPCRouter({
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
  updateModel: publicProcedure
    .input(
      z.object({
        modelID: z.number(),
        modelName: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const res: Model = await db.model.update({
        where: {
          modelID: input.modelID,
        },
        data: {
          modelName: input.modelName,
        },
      });

      if (!res) {
        throw new Error("Failed to update model");
      }
      return res;
    }),
  getModelByID: publicProcedure
    .input(
      z.object({
        modelID: z.number(),
      }),
    )
    .query(async ({ input }) => {
      const res: Model | null = await db.model.findUnique({
        where: {
          modelID: input.modelID,
        },
      });

      if (!res) {
        throw new Error("Failed to get model");
      }
      return res;
    }),
  getModelsByName: publicProcedure
    .input(
      z.object({
        modelName: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const res: Model[] = await db.model.findMany({
        where: {
          modelName: input.modelName,
        },
      });

      if (!res) {
        throw new Error("Failed to get models");
      }
      return res;
    }),
});
