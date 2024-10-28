export interface ArkivGPTSummaryResponse {
  id: number;
  resolution: string;
  documentPath: string;
}

export interface ArkivGPTDocumentResponse {
  document: string; // base64 encoded
  contentType: string;
}
