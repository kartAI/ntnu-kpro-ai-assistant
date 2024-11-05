"use client";

import React, { useState } from "react";
import FileList from "./FileList";
import Results from "./Results";
import FilePreview from "./FilePreview";
import type { Detection } from "~/types/detection";
import { api } from "~/trpc/react";
import { Input } from "./ui/input";

async function fetchDetection(formData: FormData): Promise<Detection[]> {
  const response = await fetch("http://localhost:5001/detect/", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload files");
  }

  return response.json() as Promise<Detection[]>;
}

const CadaidPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState<Detection[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [applicationId, setApplicationId] = useState<number | null>(null);
  const createApplicationMutation =
    api.application.createApplication.useMutation();
  const createResponseMutation = api.response.createResponse.useMutation();
  const createModelMutation = api.model.createModel.useMutation();
  const utils = api.useUtils();

  /**
   * Handles file upload by sending selected files to the backend.
   * @param event - The file input change event.
   */
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.files) {
      const uploadedFiles = Array.from(event.target.files);
      if (uploadedFiles.length === 0) {
        setErrorMessage("No files selected");
        return;
      }

      const ALLOWED_FILE_TYPES = ["application/pdf", "image/jpeg", "image/png"];
      const invalidFiles = uploadedFiles.filter(
        (file) => !ALLOWED_FILE_TYPES.includes(file.type),
      );
      if (invalidFiles.length > 0) {
        setErrorMessage("Invalid file type.");
        return;
      }

      setIsLoading(true);
      setFiles((prevFiles) => [...prevFiles, ...uploadedFiles]);

      const formData = new FormData();
      uploadedFiles.forEach((file) => {
        formData.append("uploaded_files", file);
      });

      try {
        const detections = await fetchDetection(formData);
        setResults((prevResults) => [...prevResults, ...detections]);

        // Add detections to the database
        const modelData = await utils.model.getModelsByName.ensureData({
          modelName: "CADAiD",
        });

        // Kind of awful, maybe change the getModelsByName to return a single model, since the names are unique, but have to change schema for that
        let model = modelData.find((model) => model.modelName === "CADAiD");

        if (!model) {
          console.log("CREATING MODEL");
          const newModel = await createModelMutation.mutateAsync({
            modelName: "CADAiD",
          });
          model = newModel;
        }

        if (!modelData) {
          // Model doesn't exist, create it
          createModelMutation.mutate({ modelName: model.modelName });
        }

        // Use a local variable to hold the application ID from state
        let applicationIdToUse = applicationId;

        if (!applicationIdToUse) {
          // User hasn't entered an application ID, create a new application
          const application = await createApplicationMutation.mutateAsync({
            status: "NEW",
            address: "Adresseveien 123",
            municipality: "Oslo",
            submissionDate: new Date(),
          });
          setApplicationId(application.applicationID);
          applicationIdToUse = application.applicationID;
        }

        detections.forEach((detection) => {
          createResponseMutation
            .mutateAsync({
              response: JSON.stringify(detection),
              modelID: model.modelID,
              applicationID: applicationIdToUse,
            })
            .catch((error) => {
              console.error(error);
              setErrorMessage("En feil oppsto under lagring av responsen.");
            });
        });
      } catch (error) {
        console.error(error);
        setErrorMessage("En feil oppsto under opplasting av filer.");
      } finally {
        setIsLoading(false); // Ensure loading state is reset
      }
    }
  };

  /**
   * Removes a file and its corresponding result from the state.
   * @param fileName - The name of the file to remove.
   */
  const handleFileRemove = (fileName: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
    setResults((prevResults) =>
      prevResults.filter((result) => result.file_name !== fileName),
    );
  };

  const handleApplicationIdChanged = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    try {
      setApplicationId(parseInt(event.target.value));
    } catch (error) {
      setErrorMessage("Ugyldig byggesaks-id");
      console.error(error);
      setApplicationId(null);
    }
  };

  return (
    <div
      className="flex min-h-screen flex-col p-6 md:flex-row"
      data-cy="main-container"
    >
      {/* Left Column */}
      <div className="w-full md:w-1/3 md:pr-4" data-cy="left-column">
        <div className="m-4">
          <label htmlFor=".application-id">
            Skriv inn en byggesaks-id (la den være tom for å lage en ny
            byggesak):
          </label>
          <Input
            className="mt-2"
            id="application-id"
            onChange={handleApplicationIdChanged}
            placeholder="Byggesaks-id"
          />
        </div>
        <FileList
          files={files}
          onRemove={handleFileRemove}
          onUpload={handleFileUpload}
        />

        {isLoading && (
          <div className="mb-4 flex items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
          </div>
        )}

        {errorMessage && (
          <div
            className="mb-4 rounded bg-red-100 p-2 text-red-700"
            role="alert"
            aria-live="assertive"
            data-cy="submission-validation"
          >
            {errorMessage}
          </div>
        )}

        <Results results={results} />
      </div>

      {/* Right Column */}
      <div className="w-full md:w-2/3" data-cy="right-column">
        <FilePreview files={files} />
      </div>
    </div>
  );
};

export default CadaidPage;
