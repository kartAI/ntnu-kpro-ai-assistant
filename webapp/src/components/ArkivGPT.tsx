"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import type { ArkivGPTSummaryResponse } from "~/types/arkivgpt";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { LinkIcon, Info } from "lucide-react";
import { Button } from "./ui/button";

export default function ArkivGPTPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<ArkivGPTSummaryResponse[]>([]);
  const [gnr, setGnr] = useState<string>("306");
  const [bnr, setBnr] = useState<string>("146");
  const [snr, setSnr] = useState<string>("0");
  const [error, setError] = useState<string>("");
  const [isCalled, setIsCalled] = useState<boolean>(false);

  const utils = api.useUtils();

  const handleFetch = async () => {
    if (!gnr || !bnr) {
      setError("gnr og bnr er påkrevd.");
      return;
    }

    if (!/^\d+$/.test(gnr) || !/^\d+$/.test(bnr) || (snr && !/^\d+$/.test(snr))) {
      setError("Vennligst skriv inn tall for gnr, bnr, and snr.");
      return;
    }

    setError("");
    setIsLoading(true);
    setIsCalled(true);

    const data = (await utils.arkivgpt.fetchResponse.fetch({
      gnr: Number(gnr),
      bnr: Number(bnr),
      snr: snr ? Number(snr) : 0,
    })) ?? [];

    setResponse(data);
    setIsLoading(false);
  };

  const handleGetDocument = async (documentPath: string) => {
    const data = await utils.arkivgpt.fetchDocument.fetch({
      documentPath: documentPath,
    });
  
    const { document, contentType } = data;
    const byteCharacters = atob(document);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: contentType });
  
    // Create a URL for the blob and open it in a new window
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  return (
    <div className={`min-h-screen flex flex-col relative`}>
      <div className="flex flex-col w-full">
        <h1 className="text-3xl font-bold py-10 px-20 text-left">ArkivGPT</h1>
        <div className="pl-20 w-auto flex items-center space-x-2 text-gray-500 my-2">
          <Info className="w-5 h-5" />
          <span>Du må skrive gnr: 306, bnr: 146, snr: 0 for å få respons</span>
        </div>
        <div className="pl-20 gap-4 flex flex-row items-start w-full justify-left mb-4">
          <input
            type="text"
            placeholder="Gårdsnummer (gnr)"
            value={gnr}
            onChange={(e) => setGnr(e.target.value.replace(/\D/, ""))}
            className="border border-gray-300 px-2 py-1 rounded-md"
          />
          <input
            type="text"
            placeholder="Bruksnummer (bnr)"
            value={bnr}
            onChange={(e) => setBnr(e.target.value.replace(/\D/, ""))}
            className="border border-gray-300 px-2 py-1 rounded-md"
          />
          <input
            type="text"
            placeholder="Seksjonsnummer (snr)"
            value={snr}
            onChange={(e) => setSnr(e.target.value.replace(/\D/, ""))}
            className="border border-gray-300 px-2 py-1 rounded-md"
          />
        </div>
        <span className="w-auto pl-20 gap-2">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button onClick={handleFetch} disabled={isLoading} className="mb-8">
            {isLoading ? "Loading..." : "Call API"}
          </Button>
        </span>
        {isCalled && (
            <div className="flex-grow w-full flex flex-col items-center px-10 relative mt-20">
          <div className="w-full max-w-6xl">
            <Table className="text-lg">
              <TableHeader>
                <TableRow>
                  <TableHead className="py-4 px-6">År</TableHead>
                  <TableHead className="py-4 px-6">AI-Oppsummering</TableHead>
                  <TableHead className="py-4 px-6">Link</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, idx) => (
                    <TableRow key={idx} className="animate-pulse opacity-50">
                      <TableCell className="py-4 px-6 blur-sm">Loading...</TableCell>
                      <TableCell className="py-4 px-6 blur-sm">Loading AI-Oppsummering...</TableCell>
                      <TableCell className="py-4 px-6 blur-sm">
                        <LinkIcon className="w-6 h-6" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : response.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-red-500 text-xl">
                      No data available
                    </TableCell>
                  </TableRow>
                ) : (
                  response.map((res) => (
                    <TableRow key={res.id}>
                      <TableCell className="py-4 px-6">{res.year}</TableCell>
                      <TableCell className="py-4 px-6">{res.resolution}</TableCell>
                      <TableCell className="py-4 px-6">
                        <button onClick={() => handleGetDocument(res.documentPath)}>
                          <LinkIcon className="w-6 h-6" />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
              </div>
            )}
          </div>
        </div>
          )
        }
      </div>
    </div>
  );
}
