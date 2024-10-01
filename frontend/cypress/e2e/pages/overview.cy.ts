describe('DataTable component displays data correctly', () => {
  beforeEach(() => {
    cy.visit('/mottakskontroll/dine-saker');
  });

  it('renders the correct number of rows', () => {
    cy.get('table tbody tr').should('have.length', 6); // Assuming 6 items per page
  });

  it('displays data in each column correctly', () => {
    // Replace with actual column headers and expected data
    cy.get('table thead th').then((headers) => {
      const columnCount = headers.length;
      cy.get('table tbody tr:first-child td').should('have.length', columnCount);
      // Add more specific checks based on your data
    });
  });

  it('shows "No results." when there is no data', () => {
    // Simulate no data scenario
    // TODO: Replace with actual API call
    // cy.intercept('GET', '/api/data', { body: [] }).as('getData');
    // cy.visit('/mottakskontroll/dine-saker');
    // cy.wait('@getData');
    // cy.get('table tbody tr td').should('contain', 'No results.');
  });

  it('paginates the table correctly using chevrons', () => {
    let firstPageContent: string[];

    cy.get('table tbody tr td:nth-child(1)').as('cells');

    cy.get('@cells').then(($cells) => {
      firstPageContent = [...$cells].map((cell) => cell.innerText);
    });
    cy.get('[data-testid="next-page"]').click();

    cy.get('@cells').then(($cells) => {
      const secondPageContent = [...$cells].map((cell) => cell.innerText);
      expect(secondPageContent).to.have.lengthOf(6);
      expect(firstPageContent).to.not.deep.equal(secondPageContent);
    });

    cy.get('[data-testid="previous-page"]').click();
    cy.get('@cells').then(($cells) => {
      const newFirstPageContent = [...$cells].map((cell) => cell.innerText);
      expect(newFirstPageContent).to.deep.equal(firstPageContent);
    });
  });

  it('paginates the table correctly using page numbers', () => {
    cy.get('[data-testid="page-2"]').click();

    cy.get('table tbody tr td:nth-child(1)').as('cells');

    cy.get('@cells').then(($cells) => {
      const secondPageContent = [...$cells].map((cell) => cell.innerText);
      expect(secondPageContent).to.have.lengthOf(6);
    });

    cy.get('[data-testid="page-1"]').click();
    cy.get('@cells').then(($cells) => {
      const firstPageContent = [...$cells].map((cell) => cell.innerText);
      expect(firstPageContent).to.have.lengthOf(6);
    });

    cy.get('[data-testid="page-last"]').click();
    cy.get('@cells').then(($cells) => {
      const lastPageContent = [...$cells].map((cell) => cell.innerText);
      expect(lastPageContent).not.to.have.lengthOf(6)
    });
  });

  it('sorts the table by "Address" column correctly', () => {
    // Ascending order when header is clicked once
    let initialAddresses: string[];
  
    cy.get('table thead th').then(($headers) => {
      // Find the index of the "Address" column
      const addressIndex = [...$headers].findIndex(header => header.innerText.includes('Adresse')) + 1;
  
      // Get the initial unsorted addresses
      cy.get(`table tbody tr td:nth-child(${addressIndex})`).then(($cells) => {
        initialAddresses = [...$cells].map((cell) => cell.innerText);
        
        cy.get('table thead th').contains('Adresse').as('addressHeader');
        cy.get(`table tbody tr td:nth-child(${addressIndex})`).as('addressCells');
  
        // Ascending sort after first click
        cy.get('@addressHeader').click();
        cy.get('@addressCells').then(($cells) => {
          const addresses = [...$cells].map((cell) => cell.innerText);
          const sortedAddresses = [...addresses].sort();
          expect(addresses).to.deep.equal(sortedAddresses);
        });
      
        // Descending sort after second click
        cy.get('@addressHeader').click();
        cy.get('@addressCells').then(($cells) => {
          const addresses = [...$cells].map((cell) => cell.innerText);
          const sortedAddresses = [...addresses].sort().reverse();
          expect(addresses).to.deep.equal(sortedAddresses);
        });
      
        // Reset to initial order after third click
        cy.get('@addressHeader').click();
        cy.get('@addressCells').then(($cells) => {
          const newAddresses = [...$cells].map((cell) => cell.innerText);
          expect(newAddresses).to.deep.equal(initialAddresses);
        });
      });
    });
  });

  it('clears the sorting when another column is clicked', () => {
    // Initial sort by "Address" column
    cy.get('table thead th').contains('Adresse').as('addressHeader');
    cy.get('table thead th').contains('Innsendingsdato').as('dateHeader');
    
    // Get address header index and address cells
    cy.get('table thead th').then(($headers) => {
      const addressIndex = [...$headers].findIndex(header => header.innerText.includes('Adresse')) + 1;
      cy.get(`table tbody tr td:nth-child(${addressIndex})`).as('addressCells');
    });

    let sortedAddresses: string[];

    cy.get('@addressHeader').click();
    cy.get('@addressCells').then(($cells) => {
      sortedAddresses = [...$cells].map((cell) => cell.innerText).sort();
      expect([...$cells].map((cell) => cell.innerText)).to.deep.equal(sortedAddresses);
    });

    // Click on another column header to clear sorting of addresses
    cy.get('@dateHeader').click();
    cy.get('@addressCells').then(($cells) => {
      const newOrder = [...$cells].map((cell) => cell.innerText);
      expect(newOrder).to.not.deep.equal(sortedAddresses);
    });
  });
  
});

