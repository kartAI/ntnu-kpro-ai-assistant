"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import type { ArkivGPTSummaryResponse } from "~/types/arkivgpt";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { LinkIcon, Info } from "lucide-react";
import { Button } from "./ui/button";

export default function ArkivGPTPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<ArkivGPTSummaryResponse[]>([]);
  const [gnr, setGnr] = useState<string>("");
  const [bnr, setBnr] = useState<string>("");
  const [snr, setSnr] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isCalled, setIsCalled] = useState<boolean>(false);

  const utils = api.useUtils();

  const handleFetch = async () => {
    if (!gnr || !bnr) {
      setError("Gårdsnummer og bruksnummer er påkrevd.");
      return;
    }

    if (
      !/^\d+$/.test(gnr) ||
      !/^\d+$/.test(bnr) ||
      (snr && !/^\d+$/.test(snr))
    ) {
      setError(
        "Vennligst skriv inn tall for gårdsnummer, bruksnummer, and seksjonsnummer.",
      );
      return;
    }

    setError("");
    setIsLoading(true);
    setIsCalled(true);

    const data =
      (await utils.arkivgpt.fetchResponse.fetch({
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
    <div className={`relative flex min-h-screen flex-col`}>
      <div className="flex w-full flex-col">
        <h1 className="px-20 py-10 text-left text-3xl font-bold">ArkivGPT</h1>
        <div className="my-2 flex w-auto items-center space-x-2 pl-20 text-gray-500">
          <Info className="h-5 w-5" />
          <span>Du må skrive gnr: 306, bnr: 146, snr: 0 for å få respons</span>
        </div>
        <div className="justify-left mb-4 flex w-full flex-row items-start gap-4 pl-20">
          <input
            type="text"
            placeholder="Gårdsnummer (gnr)"
            value={gnr}
            onChange={(e) => setGnr(e.target.value.replace(/\D/, ""))}
            className="rounded-md border border-gray-300 px-2 py-1"
          />
          <input
            type="text"
            placeholder="Bruksnummer (bnr)"
            value={bnr}
            onChange={(e) => setBnr(e.target.value.replace(/\D/, ""))}
            className="rounded-md border border-gray-300 px-2 py-1"
          />
          <input
            type="text"
            placeholder="Seksjonsnummer (snr)"
            value={snr}
            onChange={(e) => setSnr(e.target.value.replace(/\D/, ""))}
            className="rounded-md border border-gray-300 px-2 py-1"
          />
        </div>
        <span className="w-auto gap-2 pl-20">
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button onClick={handleFetch} disabled={isLoading} className="mb-8">
            {isLoading ? "Tenker..." : "Søk i arkivet"}
          </Button>
        </span>
        {isCalled && (
          <div className="relative mt-20 flex w-full flex-grow flex-col items-center px-10">
            <div className="w-full max-w-6xl">
              <Table className="text-lg">
                <TableHeader>
                  <TableRow>
                    <TableHead className="px-6 py-4">År</TableHead>
                    <TableHead className="px-6 py-4">AI-Oppsummering</TableHead>
                    <TableHead className="px-6 py-4">Link</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, idx) => (
                      <TableRow key={idx} className="animate-pulse opacity-50">
                        <TableCell className="px-6 py-4 blur-sm">
                          Loading...
                        </TableCell>
                        <TableCell className="px-6 py-4 blur-sm">
                          Loading AI-Oppsummering...
                        </TableCell>
                        <TableCell className="px-6 py-4 blur-sm">
                          <LinkIcon className="h-6 w-6" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : response.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="py-8 text-center text-xl text-red-500"
                      >
                        No data available
                      </TableCell>
                    </TableRow>
                  ) : (
                    response.map((res) => (
                      <TableRow key={res.id}>
                        <TableCell className="px-6 py-4">{res.year}</TableCell>
                        <TableCell className="px-6 py-4">
                          {res.resolution}
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <button
                            onClick={() => handleGetDocument(res.documentPath)}
                          >
                            <LinkIcon className="h-6 w-6" />
                          </button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
                  <div className="h-16 w-16 animate-spin rounded-full border-t-4 border-blue-500"></div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
