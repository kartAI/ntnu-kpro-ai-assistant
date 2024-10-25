import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const cadaidRouter = createTRPCRouter({
  fetchDetections: publicProcedure
    .input(
      z.object({
        files: z.instanceof(FormData),
      }),
    )
    .query(async ({ input }) => {
      const files = input.files;
      try {
        const detections = await fetch("http://localhost:5001/detect/", {
          method: "POST",
          body: files,
        });
        return detections.json();
      } catch (error) {
        throw new Error("Failed to upload files");
      }
    }),
});
