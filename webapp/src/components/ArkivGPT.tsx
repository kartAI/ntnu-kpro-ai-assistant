"use client";

import axios, { AxiosResponse } from "axios";
import { useState } from "react";
import { api } from "~/trpc/react";
import type { ArkivGPTSummaryResponse } from "~/types/arkivgpt";

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

export default function ArkivGPTPage() {
  const [responses, setResponses] = useState<ArkivGPTSummaryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<ArkivGPTSummaryResponse[]>([]);

  const utils = api.useUtils();

  const handleFetch = async () => {
    setIsLoading(true);
    // Continuously fetch chunks of data from the API
    const data =
      (await utils.arkivgpt.fetchResponse.fetch({
        gnr: 306,
        bnr: 146,
        snr: 0,
      })) ?? [];
    console.log(data);
    setResponse(data);
    setIsLoading(false);
  };
  // const responses = [] as ArkivGPTSummaryResponse[];
  //   const response: AxiosResponse = await axios.get<string>(
  //     `http://localhost/api/Summary?GNR=${306}&BNR=${146}&SNR=${0}`,
  //     {
  //       responseType: "stream",
  //     },
  //   );

  //   const stream = response.data as unknown as NodeJS.ReadableStream;

  //   stream.on("data", (chunk: Buffer) => {
  //     const dataString = chunk.toString();
  //     const entries = dataString.split("\n\n");
  //     const parsedData: ParsedData[] = entries
  //       .filter((entry) => entry.startsWith("data: "))
  //       .map((entry) => {
  //         // Remove the `data: ` prefix and parse the JSON content
  //         const dataString = entry.replace("data: ", "").trim();
  //         const parsedEntry = JSON.parse(dataString) as ParsedData;

  //         return parsedEntry;
  //       });

  //     const mappedResponses = parsedData.map(mapToArkivGPTSummaryResponse);
  //     setResponses((prevResponses) => [...prevResponses, ...mappedResponses]);
  //     // responses.push(...mappedResponses);
  //   });

  //   stream.on("error", (error) => {
  //     console.error("Error fetching response for document:", error);
  //     throw new Error("Failed to fetch ArkivGPT response");
  //   });

  //   stream.on("end", () => {
  //     console.log("Stream ended");
  //     setIsLoading(false);
  //     // return responses;
  //   });
  // };

  return (
    <div>
      <h1>ArkivGPT</h1>
      <button onClick={handleFetch} disabled={isLoading}>
        {isLoading ? "Loading..." : "Call API"}
      </button>
      {response.map((res) => (
        <div key={res.id}>
          <h2>{res.resolution}</h2>
          <p>{res.documentPath}</p>
        </div>
      ))}
    </div>
  );
}
