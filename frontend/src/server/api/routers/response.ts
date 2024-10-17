import { z } from "zod";
import { db } from "~/server/db";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { type Response } from "@prisma/client";

export const responsesRouter = createTRPCRouter({
  createResponse: publicProcedure
    .input(
      z.object({
        response: z.string(),
        modelID: z.number(),
        applicationID: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      const res: Response = await db.response.create({
        data: {
          response: input.response,
          modelID: input.modelID,
          applicationID: input.applicationID,
        },
      });

      if (!res) {
        throw new Error("Failed to create application");
      }
      return res;
    }),
  updateResponse: publicProcedure
    .input(
      z.object({
        responseID: z.number(),
        response: z.string().optional(),
        modelID: z.number().optional(),
        applicationID: z.number().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const res: Response = await db.response.update({
        where: {
          responseID: input.responseID,
        },
        data: {
          response: input.response,
          modelID: input.modelID,
          applicationID: input.applicationID,
        },
      });

      if (!res) {
        throw new Error("Failed to update application");
      }
      return res;
    }),
  getResponse: publicProcedure
    .input(
      z.object({
        responseID: z.number(),
      }),
    )
    .query(async ({ input }) => {
      const res: Response | null = await db.response.findUnique({
        where: {
          responseID: input.responseID,
        },
      });

      if (!res) {
        throw new Error("Failed to get application");
      }
      return res;
    }),
});
