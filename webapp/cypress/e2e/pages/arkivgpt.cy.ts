describe('ArkivGPTPage Component', () => {
  beforeEach(() => {
    cy.visit("/under-soknad/arkivgpt")
  })
  
  beforeEach(() => {
    // Mock the tRPC fetchResponse procedure
    cy.intercept('POST', 'trpc/api/arkivgpt.fetchResponse', (req) => {
      req.reply({
        statusCode: 200,
        body: {
          result: {
            data: [
              {
                id: '1',
                resolution: 'Mocked AI Summary',
                documentPath: 'mocked/document/path',
              },
            ],
          },
        },
      });
    }).as('fetchResponse');

    // Mock the tRPC fetchDocument procedure
    cy.intercept('POST', '/api/arkivgpt.fetchDocument', (req) => {
      req.reply({
        statusCode: 200,
        body: {
          result: {
            data: {
              document: btoa('%PDF-1.4 Mock PDF Content...'),
              contentType: 'application/pdf',
            },
          },
        },
      });
    }).as('fetchDocument');
  });

  it('should return results when clicking CALL API with valid numbers', () => {
    // Click the "Call API" button
    cy.contains('Call API').click();

    // Wait for the API call to complete
    cy.wait('@fetchResponse');

    // Verify that the mocked data is displayed
    cy.contains('Mocked AI Summary').should('be.visible');
    cy.contains('Dokument').should('be.visible');
  });

  it('should display "No data available" when inputting negative or invalid numbers', () => {
    // Input invalid numbers
    cy.get('input[placeholder="Gårdsnummer (gnr)"]').clear().type('-123');
    cy.get('input[placeholder="Bruksnummer (bnr)"]').clear().type('abc');
    cy.get('input[placeholder="Seksjonsnummer (snr)"]').clear().type('!@#');

    // Click the "Call API" button
    cy.contains('Call API').click();

    // Verify that the error message is displayed
    cy.contains('Please enter valid numbers for gnr, bnr, and snr.').should('be.visible');

    // Ensure no data is displayed in the table
    cy.get('table').within(() => {
      cy.contains('Loading...').should('not.exist');
      cy.contains('No data available').should('be.visible');
    });
  });

  it('should open a PDF view when clicking the link element for a response', () => {
    // Click the "Call API" button
    cy.contains('Call API').click();

    // Wait for the API call to complete
    cy.wait('@fetchResponse');

    // Click the link icon to fetch the document
    cy.get('table').find('button').click();

    // Wait for the fetchDocument call
    cy.wait('@fetchDocument');

    // Verify that the PDF iframe is displayed
    cy.get('iframe[title="PDF Viewer"]').should('be.visible');
  });
});
