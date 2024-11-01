export interface ArkivGPTSummaryResponse {
  id: number;
  resolution: string;
  documentPath: string;
  year: string;
}

export interface ArkivGPTDocumentResponse {
  document: string; // base64 encoded
  contentType: string;
}
