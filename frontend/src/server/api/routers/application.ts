import { type Application } from "@prisma/client";
import { z } from "zod";
import { db } from "~/server/db";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const VALUES = ["NEW", "APPROVED", "UNDER_REVIEW", "REJECTED"] as const;

export const applicationsRouter = createTRPCRouter({
  createApplication: publicProcedure
    .input(
      z.object({
        applicationID: z.number(),
        submissionDate: z.string().date(),
        status: z.enum(VALUES),
        address: z.string(),
        municipality: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const res: Application = await db.application.create({
        data: {
          applicationID: input.applicationID,
          submissionDate: input.submissionDate,
          status: input.status,
          address: input.address,
          municipality: input.municipality,
        },
      });

      if (!res) {
        throw new Error("Failed to create application");
      }
      return res;
    }),
  updateApplication: publicProcedure
    .input(
      z.object({
        applicationID: z.number(),
        submissionDate: z.string().date().optional(),
        status: z.enum(VALUES).optional(),
        address: z.string().optional(),
        municipality: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const res: Application = await db.application.update({
        where: { applicationID: input.applicationID },
        data: {
          submissionDate: input.submissionDate,
          status: input.status,
          address: input.address,
          municipality: input.municipality,
        },
      });

      if (!res) {
        throw new Error("Failed to update application");
      }
      return res;
    }),
  getApplication: publicProcedure
    .input(z.object({ applicationID: z.number() }))
    .query(async ({ input }) => {
      const res: Application | null = await db.application.findUnique({
        where: { applicationID: input.applicationID },
      });

      if (!res) {
        throw new Error("Application not found");
      }
      return res;
    }),
  getAllApplications: publicProcedure.input(z.object({})).query(async () => {
    const res: Application[] = await db.application.findMany();

    if (!res) {
      throw new Error("Failed to get applications");
    }
    return res;
  }),
});
