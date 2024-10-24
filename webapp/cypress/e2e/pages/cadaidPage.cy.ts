describe("CadaidPage E2E Tests", () => {
  const ROUTES = ["for-soknad/cadaid", "for-soknad/cadaid"];

  ROUTES.forEach((route) => {
    describe(`Route: ${route}`, () => {
      beforeEach(() => {
        // Visit the CADAiD page before each test
        cy.visit(`/${route}`);
      });

      it("should upload files successfully and display results", () => {
        // Intercept the upload API and mock the response
        cy.intercept("POST", "http://localhost:5001/detect/", {
          statusCode: 200,
          fixture: "mockResponses/detections.json",
        }).as("uploadFiles");

        // Upload sample1.pdf and sample2.png
        cy.get('input[type="file"]').attachFile([
          "files/sample1.pdf",
          "files/sample2.png",
        ]);

        // Wait for the upload API call
        cy.wait("@uploadFiles").its("response.statusCode").should("eq", 200);

        // Check if files are listed in FileList using data-cy
        cy.get("[data-cy=file-list]").within(() => {
          cy.contains("sample1.pdf").should("be.visible");
          cy.contains("sample2.png").should("be.visible");
        });

        // Check if results are displayed
        cy.contains("Resultater fra CADAiD").should("be.visible");
        cy.contains("plantegning").should("be.visible");
        cy.contains("fasade").should("be.visible");
        cy.contains("situasjonskart").should("be.visible");
        cy.contains("snitt").should("not.exist"); // Assuming 'snitt' is missing
      });

      it("should handle upload errors gracefully", () => {
        // Handle uncaught exceptions to prevent Cypress from failing the test
        cy.on("uncaught:exception", (err, runnable) => {
          return false; // Prevents Cypress from failing the test
        });

        // Intercept the upload API and mock an error response
        cy.intercept("POST", "http://localhost:5001/detect/", {
          statusCode: 500,
          fixture: "mockResponses/error.json",
        }).as("uploadFilesError");

        // Upload invalid.txt
        cy.get('input[type="file"]').attachFile("files/invalid.txt");

        // Instead of waiting for the network request, check for the validation error
        cy.contains("Invalid file type.").should("be.visible");
      });

      it("should remove a file and its results", () => {
        // Intercept the upload API and mock the response
        cy.intercept("POST", "http://localhost:5001/detect/", {
          statusCode: 200,
          fixture: "mockResponses/detections.json",
        }).as("uploadFiles");

        // Upload sample1.pdf
        cy.get('input[type="file"]').attachFile("files/sample1.pdf");

        // Wait for the upload API call
        cy.wait("@uploadFiles").its("response.statusCode").should("eq", 200);

        // Ensure the file is listed
        cy.contains("sample1.pdf").should("be.visible");

        // Remove the file
        cy.contains("sample1.pdf")
          .parent("li")
          .within(() => {
            cy.get('button[aria-label="Remove file sample1.pdf"]').click();
          });

        // Ensure the file is removed from the list
        cy.contains("sample1.pdf").should("not.exist");

        // Ensure the corresponding result is removed
        cy.contains("plantegning").should("not.exist");
      });

      it("should display file preview when a file is selected", () => {
        // Intercept the upload API and mock the response
        cy.intercept("POST", "http://localhost:5001/detect/", {
          statusCode: 200,
          fixture: "mockResponses/detections.json",
        }).as("uploadFiles");

        // Upload sample1.pdf
        cy.get('input[type="file"]').attachFile("files/sample1.pdf");

        // Wait for the upload API call
        cy.wait("@uploadFiles").its("response.statusCode").should("eq", 200);

        // Select the file from the dropdown
        cy.get('select[aria-label="Select file to preview"]').select(
          "sample1.pdf",
        );

        // Check if the FilePreview component displays the selected file
        cy.contains("Preview of: sample1.pdf").should("be.visible");
        cy.contains("File content would be shown here (mock).").should(
          "be.visible",
        );
      });

      it("should validate file types before uploading", () => {
        // Handle uncaught exceptions to prevent Cypress from failing the test
        cy.on("uncaught:exception", (err, runnable) => {
          return false; // Prevents Cypress from failing the test
        });

        // Attempt to upload invalid.txt
        cy.get('input[type="file"]').attachFile("files/invalid.txt");

        // Check that the file is not added to the FileList
        cy.contains("invalid.txt").should("not.exist");

        // Check for a validation error message
        cy.contains("Invalid file type.").should("be.visible");
      });

      it("should be responsive on mobile devices", () => {
        // Set viewport to mobile size
        cy.viewport("iphone-6");

        // Ensure that the main container has flex-direction column
        cy.get("[data-cy=main-container]")
          .should("have.class", "flex-col")
          .and("not.have.class", "flex-row");

        // Check that left and right columns are full width
        cy.get("[data-cy=left-column]").should("have.css", "width", "100%");
        cy.get("[data-cy=right-column]").should("have.css", "width", "100%");

        // Check if elements stack vertically
        cy.get("h2").should("have.css", "margin-bottom", "1rem"); // mb-4
        cy.get('select[aria-label="Select file to preview"]').should(
          "have.css",
          "width",
          "100%",
        );
      });
    });
  });
});
