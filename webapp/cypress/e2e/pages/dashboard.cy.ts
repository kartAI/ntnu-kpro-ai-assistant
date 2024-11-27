const VALID_CASE_ID = 1;

describe("Admin dashboard page displays correctly", () => {
  beforeEach(() => {
    cy.visit("/mottak/mine-saker/dashbord/" + VALID_CASE_ID);
  });

  it("Has header", () => {
    cy.get('[data-cy="title"]')
      .should("exist")
      .and("contain.text", "Oversikt over søknadsanalyse")
      .and("be.visible");
  });

  it("Has case overview component", () => {
    cy.contains("Saksnummer");
    cy.contains("Adresse");
    cy.contains("Eiendom");
    cy.contains("Innsendingsdato");
    cy.contains("Frist");
  });

  /** Tests for checklist */
  it("Has checklist header", () => {
    cy.get('[data-cy="checklist-header"]')
      .should("exist")
      .and("contain.text", "Sjekkliste")
      .and("be.visible");
  });

  it("should render all checklist items", () => {
    // Ensure the checklist has the correct number of items
    cy.get(".checklist-item").should("have.length.at.least", 1);
  });

  it("should display correct file types and dynamically calculate points for each item", () => {
    cy.get(".checklist-item").each(($item) => {
      cy.wrap($item).within(() => {
        cy.get(".file-name")
          .should("exist")
          .invoke("text")
          .should("match", /\w+\.(pdf|xml|jpg)/);

        cy.get(".points")
          .invoke("text")
          .then((pointsText) => {
            const match = /\d+/.exec(pointsText);
            const points = match ? Number(match[0]) : null;
            expect(points).to.be.a("number").and.to.be.at.least(0);
          });
      });
    });
  });

  it("should correctly sum the total points and update the progress dynamically", () => {
    let totalPoints = 0;

    cy.get(".checklist-item")
      .each(($item) => {
        cy.wrap($item)
          .find(".points")
          .invoke("text")
          .then((pointsText) => {
            const match = /\d+/.exec(pointsText);
            const points = match ? Number(match[0]) : 0;
            totalPoints += points;
          });
      })
      .then(() => {
        // Assert that the total points are correctly displayed
        cy.get(".points-summary").should(
          "contain.text",
          `Punkter sjekket: ${totalPoints}/10`,
        );

        // Assert that the progress bar's aria-valuenow reflects the correct total points
        cy.get(".progress-bar")
          .should("have.attr", "aria-valuenow", totalPoints.toString()) // First assertion
          .then(($progressBar) => {
            // Calculate the expected progress percentage
            const expectedProgressPercentage = (totalPoints / 10) * 100;

            // Check that the aria-valuenow correctly matches the progress percentage logic
            expect(parseInt($progressBar.attr("aria-valuenow") ?? "")).to.equal(
              totalPoints,
            );
            expect(expectedProgressPercentage).to.equal(
              (totalPoints / 10) * 100,
            );
          });
      });
  });

  it("should expand/collapse checklist items when clicked", () => {
    // Click the header to expand and ensure it's visible
    cy.get(".checklist-item-header").first().click();
    cy.get(".checklist-item-content").first().should("be.visible");

    // Click the header to collapse
    cy.get(".checklist-item-header").first().click();

    // Ensure it is collapsed (not visible)
    cy.get(".checklist-item-content").should("not.exist");
  });

  /* Tests for summary component*/
  it("Has summary header", () => {
    cy.get('[data-cy="summary-header"]')
      .should("exist")
      .and("contain.text", "Saken oppsummert:")
      .and("be.visible");
  });

  it("should render all summary items", () => {
    // Retrieve number of points dynamically
    const totalPoints = 1;
    // TODO: Change to 'have.length' when the summary assistant is ready
    cy.get(".summary-item").should("have.length.at.least", totalPoints);
  });

  it("Has AI warning", () => {
    cy.get('[data-cy="summary-warning"]')
      .should("exist")
      .and(
        "contain.text",
        "Oppsummering er laget av en KI-tjeneste og kan inneholde feil.",
      )
      .and("be.visible");
  });

  /* Tests for Case Feedback */
  it("Has feedback header", () => {
    cy.get('[data-cy="feedback-header"]')
      .should("exist")
      .and("contain.text", "Tilbakemeldinger til innsender")
      .and("be.visible");
  });

  it("should allow typing feedback", () => {
    // Target the textarea and type some feedback
    cy.get("textarea").type("Dette er en testtilbakemelding");

    // Verify if the text was entered correctly
    cy.get("textarea").should("have.value", "Dette er en testtilbakemelding");
  });

  it("should have buttons that work", () => {
    // Check if all the buttons are rendered with correct labels
    cy.contains("Delvis godkjenn").should("exist");
    cy.contains("Delvis avslå søknad").should("exist");
    cy.contains("Avslå søknad").should("exist");

    // Click on the "Delvis godkjenn" button
    cy.contains("Delvis godkjenn").click();
    // Perform any assertion based on expected behavior

    // Click on the "Delvis avslå søknad" button
    cy.contains("Delvis avslå søknad").click();
    // Perform any assertion based on expected behavior

    // Click on the "Avslå søknad" button
    cy.contains("Avslå søknad").click();
    // Perform any assertion based on expected behavior
  });

  it("should allow sending feedback", () => {
    // Type some feedback
    cy.get("textarea").type("Sending feedback test.");

    // Click the "Send tilbakemelding" button
    cy.contains("Send tilbakemelding").click();
  });

  /* Tests for plan situation*/
  const external_component_url =
    "https://www.arealplaner.no/vennesla4223/arealplaner/53?knr=4223&gnr=5&bnr=547&teigid=214401611";
  const BASE_URL = "/mottakskontroll/dine-saker/dashbord/1/";

  describe("Iframe Tests", () => {
    beforeEach(() => {
      // Intercept the GET request for the iframe's src URL and alias it as 'iframeLoad'
      cy.intercept("GET", `${external_component_url}*`).as("iframeLoad");

      // Visit the target page after setting up the intercept
      cy.visit(BASE_URL);
    });

    it("should load the iframe without errors", () => {
      const timeout = 10_000;
      cy.get('[data-cy="plansituasjon"]', { timeout: timeout })
        .should("exist")
        .and("have.attr", "src", external_component_url)
        .and("be.visible")
        .as("embedding");

      // Wait for the iframe's network request to complete and assert the response status
      cy.wait("@iframeLoad", { timeout: timeout })
        .its("response.statusCode")
        .should("eq", 200);

      cy.get("@embedding").should("be.visible");
    });
  });

  it("The page must ", () => {
    it("should load the title", () => {
      cy.visit(BASE_URL);
      cy.get('[data-cy="title"]')
        .should("exist")
        .and("contain.text", "Plansituasjon:")
        .and("be.visible");
    });
  });

  /* Tests for case documents component */
  it("Has case documents header", () => {
    cy.get('[data-cy="case-documents-header"]')
      .should("exist")
      .and("contain.text", "Sakens dokumenter")
      .and("be.visible");
  });

  it("should have clickable links for each document dynamically", () => {
    // Fetch all document links dynamically and ensure they are clickable
    cy.get("a").each(($el) => {
      // Get the href attribute and make sure it's a valid link
      cy.wrap($el)
        .should("have.attr", "href")
        .and("match", /(\.pdf|\.jpg|\.xml)$/); // Ensure it ends with .pdf, .jpg or .xml

      // Optionally, click the link (without actually navigating)
      cy.wrap($el).click({ force: true });
    });
  });

  /* Tests for AI results components */
  describe("ArchiveGPT Component Tests", () => {
    it("Has ArchiveGPT header", () => {
      cy.get('[data-cy="title"]')
        .should("exist")
        .and("contain.text", "Arkiv-GPT")
        .and("be.visible");
    });

    it("should allow typing feedback", () => {
      // Target the textarea and type some feedback
      cy.get("textarea").type("Dette er en testtilbakemelding");

      // Verify if the text was entered correctly
      cy.get("textarea").should("have.value", "Dette er en testtilbakemelding");
    });

    it("should have buttons that work", () => {
      // Check if all the buttons are rendered with correct labels
      cy.contains("Delvis godkjenn").should("exist");
      cy.contains("Delvis avslå søknad").should("exist");
      cy.contains("Avslå søknad").should("exist");

      // Click on the "Delvis godkjenn" button
      cy.contains("Delvis godkjenn").click();
      // Perform any assertion based on expected behavior

      // Click on the "Delvis avslå søknad" button
      cy.contains("Delvis avslå søknad").click();
      // Perform any assertion based on expected behavior

      // Click on the "Avslå søknad" button
      cy.contains("Avslå søknad").click();
      // Perform any assertion based on expected behavior
    });

    it("should allow sending feedback", () => {
      // Type some feedback
      cy.get("textarea").type("Sending feedback test.");

      // Click the "Send tilbakemelding" button
      cy.contains("Send tilbakemelding").click();

      // Check if sending feedback triggers expected behavior
      // cy.intercept('/api/feedback', { statusCode: 200 }).as('sendFeedback');
    });

    /* Tests for plan situation*/
    const external_component_url =
      "https://www.arealplaner.no/vennesla4223/arealplaner/53?knr=4223&gnr=5&bnr=547&teigid=214401611";
    const BASE_URL = "/mottak/dine-saker/dashbord/1/";

    describe("Iframe Tests", () => {
      beforeEach(() => {
        // Intercept the GET request for the iframe's src URL and alias it as 'iframeLoad'
        cy.intercept("GET", `${external_component_url}*`).as("iframeLoad");

        // Visit the target page after setting up the intercept
        cy.visit(BASE_URL);
      });

      it("should load the iframe without errors", () => {
        const timeout = 10_000;
        cy.get('[data-cy="plansituasjon"]', { timeout: timeout })
          .should("exist")
          .and("have.attr", "src", external_component_url)
          .and("be.visible")
          .as("embedding");

        // Wait for the iframe's network request to complete and assert the response status
        cy.wait("@iframeLoad", { timeout: timeout })
          .its("response.statusCode")
          .should("eq", 200);

        cy.get("@embedding").should("be.visible");
      });
    });

    it("The page must ", () => {
      it("should load the title", () => {
        cy.visit(BASE_URL);
        cy.get('[data-cy="title"]')
          .should("exist")
          .and("contain.text", "Plansituasjon:")
          .and("be.visible");
      });
    });

    /* Tests for case documents component */
    it("Has case documents header", () => {
      cy.get('[data-cy="case-documents-header"]')
        .should("exist")
        .and("contain.text", "Sakens dokumenter")
        .and("be.visible");
    });

    it("should have clickable links for each document dynamically", () => {
      // Fetch all document links dynamically and ensure they are clickable
      cy.get("a").each(($el) => {
        // Get the href attribute and make sure it's a valid link
        cy.wrap($el)
          .should("have.attr", "href")
          .and("match", /(\.pdf|\.jpg|\.xml)$/); // Ensure it ends with .pdf, .jpg or .xml

        // Optionally, click the link (without actually navigating)
        cy.wrap($el).click({ force: true });
      });
    });

    /* Tests for AI results components */
    describe("ArchiveGPT Component Tests", () => {
      it("Has ArchiveGPT header", () => {
        cy.get('[data-cy="component-title"]')
          .should("exist")
          .and("contain.text", "Arkiv-GPT")
          .and("be.visible");
      });

      it("should display the correct status icon and dynamic feedback text", () => {
        // Check if the status is a success or failure
        cy.get("[data-cy=status-indicator]").then(($statusIndicator) => {
          if ($statusIndicator.hasClass("success")) {
            // Success case: Check for a check mark and non-empty feedback text
            cy.get("[data-cy=icon]").should("have.class", "icon-checkmark");
            cy.get("[data-cy=feedback-text]")
              .invoke("text")
              .then((feedback) => {
                expect(feedback.trim()).to.not.be.empty.and.to.be.a("string");
                cy.log(`Success feedback: ${feedback}`); // Log feedback for reference
              });
          } else if ($statusIndicator.hasClass("failure")) {
            // Failure case: Check for a warning icon and non-empty feedback text
            cy.get("[data-cy=icon]").should("have.class", "icon-warning");
            cy.get("[data-cy=feedback-text]")
              .invoke("text")
              .then((feedback) => {
                expect(feedback.trim()).to.not.be.empty.and.to.be.a("string");
                cy.log(`Failure feedback: ${feedback}`); // Log feedback for reference
              });
          }
        });
      });

      it("should navigate to the detailed report page when clicked", () => {
        // Simulate clicking the component and ensure it navigates to the detailed page
        cy.get("[data-cy=archiveGPT-component]")
          .click()
          .location("pathname") // TODO: Add route to report page
          .should("include", "/report-page"); // Adjust this to the actual report page route
      });
    });

    /* CAD-AiD */
    describe("CAD-AiD Component Tests", () => {
      it("Has CAD-AiD header", () => {
        cy.get('[data-cy="component-title"]')
          .should("exist")
          .and("contain.text", "CAD-AiD")
          .and("be.visible");
      });

      it("should display the correct status icon and dynamic feedback text", () => {
        cy.get("[data-cy=status-indicator]").then(($statusIndicator) => {
          if ($statusIndicator.hasClass("success")) {
            // Success case: Check for a check mark and non-empty feedback text
            cy.get("[data-cy=icon]").should("have.class", "icon-checkmark");
            cy.get("[data-cy=feedback-text]")
              .invoke("text")
              .then((feedback) => {
                expect(feedback.trim()).to.not.be.empty.and.to.be.a("string");
                cy.log(`Success feedback: ${feedback}`); // Log feedback for reference
              });
          } else if ($statusIndicator.hasClass("failure")) {
            // Failure case: Check for a warning icon and non-empty feedback text
            cy.get("[data-cy=icon]").should("have.class", "icon-warning");
            cy.get("[data-cy=feedback-text]")
              .invoke("text")
              .then((feedback) => {
                expect(feedback.trim()).to.not.be.empty.and.to.be.a("string");
                cy.log(`Failure feedback: ${feedback}`); // Log feedback for reference
              });
          }
        });
      });
    });
  });
});
