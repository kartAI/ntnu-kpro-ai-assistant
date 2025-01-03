describe("DataTable component displays data correctly", () => {
  beforeEach(() => {
    cy.visit("/mottakskontroll/dine-saker");
  });

  it("renders the correct number of rows", () => {
    cy.get("table tbody tr").should("have.length", 6);
  });

  it("displays data in each column correctly", () => {
    cy.get("table thead th").then((headers) => {
      const columnCount = headers.length;
      cy.get("table tbody tr:first-child td").should(
        "have.length",
        columnCount,
      );
    });
  });

  it('shows "No results." when there is no data', () => {
    // Simulate no data scenario
    // TODO: Replace with actual API call
  });

  it("paginates the table correctly using chevrons", () => {
    let firstPageContent: string[];

    cy.get("table tbody tr td:nth-child(1)").as("cells");

    cy.get("@cells").then(($cells) => {
      firstPageContent = [...$cells].map((cell) => cell.innerText);
    });
    cy.get('[data-testid="next-page"]').click();

    cy.get("@cells").then(($cells) => {
      const secondPageContent = [...$cells].map((cell) => cell.innerText);
      expect(secondPageContent).to.have.lengthOf(6);
      expect(firstPageContent).to.not.deep.equal(secondPageContent);
    });

    cy.get('[data-testid="previous-page"]').click();
    cy.get("@cells").then(($cells) => {
      const newFirstPageContent = [...$cells].map((cell) => cell.innerText);
      expect(newFirstPageContent).to.deep.equal(firstPageContent);
    });
  });

  it("paginates the table correctly using page numbers", () => {
    cy.get("table tbody tr td:nth-child(1)").as("cells");

    // Go to page 2
    cy.get('[data-testid="page-2"]').click();

    // Can go back to page 1
    cy.get('[data-testid="page-1"]').click();
    cy.get("@cells").then(($cells) => {
      const firstPageContent = [...$cells].map((cell) => cell.innerText);
      expect(firstPageContent).to.have.lengthOf(6);
    });

    // Last page is always visible
    cy.get('[data-testid="page-last"]').click();
    cy.get("@cells").then(($cells) => {
      const lastPageContent = [...$cells].map((cell) => cell.innerText);
      expect(lastPageContent).not.to.have.lengthOf(6);
    });
  });

  it('sorts the table by "Address" column correctly', () => {
    let initialAddresses: string[];

    cy.get("table thead th").then(($headers) => {
      // Find the index of the "Address" column
      const addressIndex =
        [...$headers].findIndex((header) =>
          header.innerText.includes("Adresse"),
        ) + 1;

      cy.get(`table tbody tr td:nth-child(${addressIndex})`).then(($cells) => {
        initialAddresses = [...$cells].map((cell) => cell.innerText);

        cy.get("table thead th").contains("Adresse").as("addressHeader");
        cy.get(`table tbody tr td:nth-child(${addressIndex})`).as(
          "addressCells",
        );

        // Ascending sort after first click
        cy.get("@addressHeader").click();
        cy.get("@addressCells").then(($cells) => {
          const addresses = [...$cells].map((cell) => cell.innerText);
          const sortedAddresses = [...addresses].sort();
          expect(addresses).to.deep.equal(sortedAddresses);
        });

        // Descending sort after second click
        cy.get("@addressHeader").click();
        cy.get("@addressCells").then(($cells) => {
          const addresses = [...$cells].map((cell) => cell.innerText);
          const sortedAddresses = [...addresses].sort().reverse();
          expect(addresses).to.deep.equal(sortedAddresses);
        });

        // Reset to initial order after third click
        cy.get("@addressHeader").click();
        cy.get("@addressCells").then(($cells) => {
          const newAddresses = [...$cells].map((cell) => cell.innerText);
          expect(newAddresses).to.deep.equal(initialAddresses);
        });
      });
    });
  });

  it("clears the sorting when another column is clicked", () => {
    // Initial sort by "Address" column
    cy.get("table thead th").contains("Adresse").as("addressHeader");
    cy.get("table thead th").contains("Innsendingsdato").as("dateHeader");

    // Get address header index and address cells
    cy.get("table thead th").then(($headers) => {
      const addressIndex =
        [...$headers].findIndex((header) =>
          header.innerText.includes("Adresse"),
        ) + 1;
      cy.get(`table tbody tr td:nth-child(${addressIndex})`).as("addressCells");
    });

    let sortedAddresses: string[];

    cy.get("@addressHeader").click();
    cy.get("@addressCells").then(($cells) => {
      sortedAddresses = [...$cells].map((cell) => cell.innerText).sort();
      expect([...$cells].map((cell) => cell.innerText)).to.deep.equal(
        sortedAddresses,
      );
    });

    // Click on another column header to clear sorting of addresses
    cy.get("@dateHeader").click();
    cy.get("@addressCells").then(($cells) => {
      const newOrder = [...$cells].map((cell) => cell.innerText);
      expect(newOrder).to.not.deep.equal(sortedAddresses);
    });
  });

  it("filters the table by municipality correctly", () => {
    cy.get("table thead th").then(($headers) => {
      const municipalityIndex =
        [...$headers].findIndex((header) =>
          header.innerText.includes("Kommune"),
        ) + 1;
      cy.get(`table tbody tr td:nth-child(${municipalityIndex})`).as(
        "municipalityCells",
      );
    });

    cy.get("@municipalityCells").should("have.length", 6);
    cy.get("@municipalityCells").contains("Oslo");

    cy.get('[data-testid="filter-button"]').click();

    // Assert that all checkboxes in the dropdown are checked
    cy.get('[data-testid="filter-content"]')
      .find('[role="menuitemcheckbox"]')
      .each(($checkbox) => {
        cy.wrap($checkbox).should("have.attr", "aria-checked", "true");
      });

    cy.get('[data-testid="filter-content"]').contains("Oslo").click();

    // Assert that after filtering, none of the cells contain "Oslo"
    cy.get("@municipalityCells").each(($cell) => {
      cy.wrap($cell).should("not.contain", "Oslo");
    });

    // Assert that Oslo is no longer checked
    cy.get('[data-testid="filter-content"]')
      .contains("Oslo")
      .should("not.have.attr", "aria-checked", "true");

    // Assert that when clicking "Fjern alle" all checkboxes are unchecked and the results are empty
    cy.get('[data-testid="filter-content"]').contains("Fjern alle").click();

    cy.get('[data-testid="filter-content"]')
      .find('[role="menuitemcheckbox"]')
      .each(($checkbox) => {
        cy.wrap($checkbox).should("have.attr", "aria-checked", "false");
      });

    cy.get("table tbody tr").as("rows").should("have.length", 1);
    cy.get("@rows").contains("No results.");

    // Assert that when clicking "Velg alle" all checkboxes are checked and the results are back to normal
    cy.get('[data-testid="filter-content"]').contains("Velg alle").click();

    cy.get('[data-testid="filter-content"]')
      .find('[role="menuitemcheckbox"]')
      .each(($checkbox) => {
        cy.wrap($checkbox).should("have.attr", "aria-checked", "true");
      });

    cy.get("table tbody tr").as("rows").should("have.length", 6);
  });

  it("navigates to new page when clicked on row", () => {
    // Find the index for the case number column
    cy.get("table thead th").then(($headers) => {
      const caseNumberIndex =
        [...$headers].findIndex((header) =>
          header.innerText.includes("Saksnummer"),
        ) + 1;
      // Get the case number of the first row
      cy.get(`table tbody tr td:nth-child(${caseNumberIndex})`)
        .first()
        .invoke("text")
        .then((caseNumber) => {
          // Click on the first
          cy.get("table tbody tr").first().click();
          // Check that the URL has changed to the correct case number
          cy.url().should(
            "include",
            `/mottakskontroll/dine-saker/dashbord/${caseNumber}`,
          );
        });
    });
  });
});
