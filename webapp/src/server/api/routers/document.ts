import { z } from "zod";
import { db } from "~/server/db";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { type Document } from "@prisma/client";

const VALUES = ["OTHER", "XML"] as const;

export const documentRouter = createTRPCRouter({
  createDocument: publicProcedure
    .input(
      z.object({
        type: z.enum(VALUES),
        document: z.string().base64(), // Get file content as base64 string, convert to Buffer in resolver
        applicationID: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      const res: Document = await db.document.create({
        data: {
          type: input.type,
          document: Buffer.from(input.document),
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
        document: z.string().base64().optional(),
        applicationID: z.number().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const res: Document = await db.document.update({
        where: { documentID: input.documentID },
        data: {
          type: input.type,
          document: Buffer.from(input.document ?? ""),
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
