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

const mapToArkivGPTSummaryResponse = (parsedEntry: ParsedData): ArkivGPTSummaryResponse => {
  // Define the regular expression to extract the year and document type, supporting Unicode word characters
  const yearTypeRegex = /^(\d{4}):\s*(\p{L}+)/u;
  const yearMatch = yearTypeRegex.exec(parsedEntry.Resolution);

  // Extract year and document type, providing default values if the match is null
  const year = yearMatch?.[1] ?? "Unknown";

  return {
    id: Number(parsedEntry.Id), // Convert id to number
    resolution: parsedEntry.Resolution,
    documentPath: parsedEntry.Document.split("?document=")[1] ?? "", // Default to an empty string if undefined
    year: year,
  };
};

const ARKIVGPT_URL = "http://localhost/api"

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

      let responses: ArkivGPTSummaryResponse[] = [];

      try {
        responses = await fetchResponse(gnr, bnr, snr);

      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error(
            "Error fetching response for document:",
            error.response?.data,
          );
          console.error("Failed to fetch ArkivGPT response",
          error.response?.data,
          );
        }
        console.error("An unknown error occurred while fetching response for document");
      }

      return responses;
    }),

  fetchDocument: publicProcedure
    .input(z.object({ documentPath: z.string() }))
    .query(async ({ input }) => {
      const { documentPath } = input;

      try {
        const response: AxiosResponse<ArrayBuffer> = await axios.get(
          `${ARKIVGPT_URL}/document?document=${documentPath}`,
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
      `${ARKIVGPT_URL}/Summary?GNR=${gnr}&BNR=${bnr}&SNR=${snr}`,
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
