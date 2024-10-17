import { z } from "zod";
import { db } from "~/server/db";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { type Document } from "@prisma/client";

const VALUES = ["OTHER"] as const;

export const documentsRouter = createTRPCRouter({
  createDocument: publicProcedure
    .input(
      z.object({
        type: z.enum(VALUES),
        document: z.instanceof(Buffer),
        applicationID: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      const res: Document = await db.document.create({
        data: {
          type: input.type,
          document: input.document,
          applicationID: input.applicationID,
        },
      });

      if (!res) {
        throw new Error("Failed to create application");
      }
      return res;
    }),
  updateDocument: publicProcedure
    .input(
      z.object({
        documentID: z.number(),
        type: z.enum(VALUES).optional(),
        document: z.instanceof(Buffer).optional(),
        applicationID: z.number().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const res: Document = await db.document.update({
        where: { documentID: input.documentID },
        data: {
          type: input.type,
          document: input.document,
          applicationID: input.applicationID,
        },
      });

      if (!res) {
        throw new Error("Failed to update document");
      }
      return res;
    }),
  getDocument: publicProcedure
    .input(z.object({ documentID: z.number() }))
    .query(async ({ input }) => {
      const res: Document | null = await db.document.findUnique({
        where: { documentID: input.documentID },
      });

      if (!res) {
        throw new Error("Document not found");
      }
      return res;
    }),
});
