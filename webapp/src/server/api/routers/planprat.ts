import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import axios, { AxiosError, type AxiosResponse } from "axios";

interface PlanpratResponse {
  answer: string;
}

const PLANPRAT_URL = process.env.PLANPRAT_URL ?? "";

export const planpratRouter = createTRPCRouter({
  fetchResponse: publicProcedure
    .input(
      z.object({
        query: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const { query } = input;

      try {
        const response: AxiosResponse<PlanpratResponse> = await axios.post(
          PLANPRAT_URL,
          {
            query: query,
          },
        );

        return response.data as unknown as PlanpratResponse;
      } catch (error) {
        if (error instanceof AxiosError) {
          throw new Error(`Failed to retrieve response: ${error.message}`);
        } else {
          console.error(error);
          throw new Error(`Unkown error`);
        }
      }
    }),
});
