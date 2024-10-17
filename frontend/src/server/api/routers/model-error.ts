import { z } from "zod";
import { db } from "~/server/db";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { type ModelError } from "@prisma/client";

export const responsesRouter = createTRPCRouter({
  createModelError: publicProcedure
    .input(
      z.object({
        error: z.string(),
        modelID: z.number(),
        responseID: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      const res: ModelError = await db.modelError.create({
        data: {
          error: input.error,
          modelID: input.modelID,
          responseID: input.responseID,
        },
      });

      if (!res) {
        throw new Error("Failed to create model error");
      }
      return res;
    }),
  updateModelError: publicProcedure
    .input(
      z.object({
        errorID: z.number(),
        error: z.string().optional(),
        modelID: z.number().optional(),
        responseID: z.number().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const res: ModelError = await db.modelError.update({
        where: {
          errorID: input.errorID,
        },
        data: {
          error: input.error,
          modelID: input.modelID,
          responseID: input.responseID,
        },
      });

      if (!res) {
        throw new Error("Failed to update model error");
      }
      return res;
    }),
  getModelError: publicProcedure
    .input(
      z.object({
        errorID: z.number(),
      }),
    )
    .query(async ({ input }) => {
      const res: ModelError | null = await db.modelError.findUnique({
        where: {
          errorID: input.errorID,
        },
      });

      if (!res) {
        throw new Error("Failed to get model error");
      }
      return res;
    }),
});
