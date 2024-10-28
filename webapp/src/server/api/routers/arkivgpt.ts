import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import axios, { type AxiosResponse } from "axios";
import type {
  ArkivGPTDocumentResponse,
  ArkivGPTSummaryResponse,
} from "~/types/arkivgpt";

interface ParsedData {
  Id: string;
  Resolution: string;
  Document: string;
}

const mapToArkivGPTSummaryResponse = (parsedEntry: ParsedData) => {
  return {
    id: parsedEntry.Id,
    resolution: parsedEntry.Resolution,
    documentPath: parsedEntry.Document.split("?document=")[1],
  } as unknown as ArkivGPTSummaryResponse;
};

export const arkivGptRouter = createTRPCRouter({
  fetchResponse: publicProcedure
    .input(
      z.object({
        gnr: z.number(),
        bnr: z.number(),
        snr: z.number(),
      }),
    )
    .query(async ({ input }) => {
      const { gnr, bnr, snr } = input;

      try {
        const responses = await fetchResponse(gnr, bnr, snr);

        // // Parse the SSE formatted response
        // const entries = response.data.split("\n\n");
        // const parsedData: ArkivGPTSummaryResponse[] = entries
        //   .filter((entry) => entry.startsWith("data: "))
        //   .map((entry) => {
        //     // Remove the `data: ` prefix and parse the JSON content
        //     const dataString = entry.replace("data: ", "").trim();
        //     const parsedEntry = JSON.parse(dataString) as ParsedData;

        //     // Map to the interface structure
        //     return {
        //       id: parsedEntry.Id,
        //       resolution: parsedEntry.Resolution,
        //       documentPath: parsedEntry.Document.split("?document=")[1],
        //     } as unknown as ArkivGPTSummaryResponse;
        //   });

        return responses;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error(
            "Error fetching response for document:",
            error.response?.data,
          );
          throw new Error("Failed to fetch ArkivGPT response");
        }
        throw new Error(
          "An unknown error occurred while fetching response for document",
        );
      }
    }),

  fetchDocument: publicProcedure
    .input(z.object({ documentPath: z.string() }))
    .query(async ({ input }) => {
      const { documentPath } = input;

      try {
        const response: AxiosResponse<ArrayBuffer> = await axios.get(
          `http://localhost/api/document?document=${documentPath}`,
          {
            responseType: "arraybuffer",
          },
        );
        const arrayBuffer = response.data;
        const buffer = Buffer.from(arrayBuffer);
        const base64 = buffer.toString("base64");

        return {
          document: base64,
          contentType: "application/pdf",
        } as unknown as ArkivGPTDocumentResponse;
      } catch (error) {
        console.error("Error fetching PDF:", error);
        throw new Error("Failed to fetch document");
      }
    }),
});

const fetchResponse = async (gnr: number, bnr: number, snr: number) => {
  try {
    const response: AxiosResponse<string> = await axios.get(
      `http://localhost/api/Summary?GNR=${gnr}&BNR=${bnr}&SNR=${snr}`,
    );

    // Split the response data by entries if needed and parse each entry
    const entries = response.data.split("\n\n");
    const parsedData: ParsedData[] = entries
      .filter((entry) => entry.startsWith("data: "))
      .map((entry) => {
        // Remove the `data: ` prefix and parse the JSON content
        const dataString = entry.replace("data: ", "").trim();
        return JSON.parse(dataString) as ParsedData;
      });

    // Map parsed entries to the desired response format
    const mappedResponses = parsedData.map(mapToArkivGPTSummaryResponse);

    return mappedResponses;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error fetching response for document:",
        error.response?.data,
      );
      throw new Error("Failed to fetch ArkivGPT response");
    }
    throw new Error(
      "An unknown error occurred while fetching response for document",
    );
  }
};
