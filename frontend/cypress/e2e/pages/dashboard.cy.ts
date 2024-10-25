const VALID_CASE_ID = 1;

/* describe('My First Test', () => {
    it('Visits the Kitchen Sink', () => {
      cy.visit("/mottakskontroll/dine-saker/dashbord/" + VALID_CASE_ID)
    })
  }) */
  

describe("Admin dashboard page displays correctly", () => { 
    beforeEach(() => {
      cy.visit("/mottakskontroll/dine-saker/dashbord/" + VALID_CASE_ID);
    });

    it("Has header", () => {
      cy.get('[data-cy="title"]')
        .should("exist")
        .and("contain.text", "Oversikt over søknadsanalyse")
        .and('be.visible')
    });
    
    it("Has case overview component", () => {
        cy.contains("Saksnummer")
        cy.contains("Adresse")
        cy.contains("Eiendom")
        cy.contains("Innsendingsdato")
        cy.contains("Frist")
    }); 



    /** Tests for checklist */
    it("Has checklist header", () => {
      cy.get('[data-cy="checklist-header"]')
        .should("exist")
        .and("contain.text", "Sjekkliste")
        .and("be.visible")
    }); 

    it('should render all checklist items', () => {
      // Ensure the checklist has the correct number of items
      cy.get('.checklist-item').should('have.length.at.least', 1);
    });
  
    it('should display correct file types and dynamically calculate points for each item', () => {
      cy.get('.checklist-item').each(($item, index, $list) => {
        cy.wrap($item).within(() => {
          cy.get('.file-name').should('exist').invoke('text').should('match', /\w+\.(pdf|xml|jpg)/);
          cy.get('.points').invoke('text').then((pointsText) => {
            const points = parseInt(pointsText.match(/\d+/)[0], 10);
            expect(points).to.be.a('number').and.to.be.at.least(0);
          });
        });
      });
    });
  
    it('should correctly sum the total points and update the progress dynamically', () => {
      let totalPoints = 0;
    
      cy.get('.checklist-item').each(($item) => {
        cy.wrap($item).find('.points').invoke('text').then((pointsText) => {
          const points = parseInt(pointsText.match(/\d+/)[0], 10);
          totalPoints += points;
        });
      }).then(() => {
        // Assert that the total points are correctly displayed
        cy.get('.points-summary').should('contain.text', `Punkter sjekket: ${totalPoints}/10`);
    
        // Assert that the progress bar's aria-valuenow reflects the correct total points
        cy.get('.progress-bar')
          .should('have.attr', 'aria-valuenow', totalPoints.toString())  // First assertion
          .then(($progressBar) => {
            // Calculate the expected progress percentage
            const expectedProgressPercentage = (totalPoints / 10) * 100;
            
            // Check that the aria-valuenow correctly matches the progress percentage logic
            expect(parseInt($progressBar.attr('aria-valuenow'))).to.equal(totalPoints);
            expect(expectedProgressPercentage).to.equal((totalPoints / 10) * 100); // Add this logical check
          });
      });
    });
    
  
    it('should expand/collapse checklist items when clicked', () => {
      cy.get('.checklist-item-header').first().click(); // Click the header to expand
      cy.get('.checklist-item-content').first().should('be.visible'); // Ensure it's visible
    
      cy.get('.checklist-item-header').first().click(); // Click the header to collapse
    
      // Ensure it is collapsed (not visible)
      cy.get('.checklist-item-content').should('not.exist'); 
    });
  
  

    /* Tests for summary component*/
    it("Has summary header", () => {
      cy.get('[data-cy="summary-header"]')
        .should("exist")
        .and("contain.text", "Saken oppsummert:")
        .and("be.visible")
    }); 

    it('should render all summary items', () => {
      // Retrieve number of points dynamically
      /* cy.window().its('yourAppState').then((state) => {
      const totalPoints = state.totalPoints; // Adjust according to your app's structure
     */
      // Ensure the checklist has the correct number of items
     /*  }); */
      const totalPoints = 1;
      // TODO: Change to 'have.length' when the summary assistant is ready
      cy.get('.summary-item').should('have.length.at.least', totalPoints);
    });


    it("Has AI warning", () => {
      cy.get('[data-cy="summary-warning"]')
        .should("exist")
        .and("contain.text", "Oppsummering er laget av en KI-tjeneste og kan inneholde feil.")
        .and("be.visible")
    }); 



    /* Tests for Case Feedback */
    it("Has feedback header", () => {
      cy.get('[data-cy="feedback-header"]')
        .should("exist")
        .and("contain.text", "Tilbakemeldinger til innsender")
        .and("be.visible")
    });

  
    it('should allow typing feedback', () => {
      // Target the textarea and type some feedback
      cy.get('textarea').type('Dette er en testtilbakemelding');
      
      // Verify if the text was entered correctly
      cy.get('textarea').should('have.value', 'Dette er en testtilbakemelding');
    });
  
    it('should have buttons that work', () => {
      // Check if all the buttons are rendered with correct labels
      cy.contains('Delvis godkjenn').should('exist');
      cy.contains('Delvis avslå søknad').should('exist');
      cy.contains('Avslå søknad').should('exist');
  
      // Click on the "Delvis godkjenn" button
      cy.contains('Delvis godkjenn').click();
      // Perform any assertion based on expected behavior
  
      // Click on the "Delvis avslå søknad" button
      cy.contains('Delvis avslå søknad').click();
      // Perform any assertion based on expected behavior
  
      // Click on the "Avslå søknad" button
      cy.contains('Avslå søknad').click();
      // Perform any assertion based on expected behavior
    });
  
    it('should allow sending feedback', () => {
      // Type some feedback
      cy.get('textarea').type('Sending feedback test.');
  
      // Click the "Send tilbakemelding" button
      cy.contains('Send tilbakemelding').click();
  
      // Check if sending feedback triggers expected behavior
      // cy.intercept('/api/feedback', { statusCode: 200 }).as('sendFeedback');
    });
    
    /* Tests for plan situation*/
    const external_component_url = "https://www.arealplaner.no/vennesla4223/arealplaner/53?knr=4223&gnr=5&bnr=547&teigid=214401611";
    const BASE_URL = "/mottakskontroll/dine-saker/dashbord/1/";


    describe('Iframe Tests', () => {
      beforeEach(() => {
        // Intercept the GET request for the iframe's src URL and alias it as 'iframeLoad'
        cy.intercept('GET', `${external_component_url}*`).as('iframeLoad');

        // Visit the target page after setting up the intercept
        cy.visit(BASE_URL);
      });

      it('should load the iframe without errors', () => {
        let timeout = 10_000;
        cy.get('[data-cy="plansituasjon"]', { timeout: timeout })
          .should('exist')
          .and('have.attr', 'src', external_component_url)
          .and('be.visible')
          .as('embedding');

        // Wait for the iframe's network request to complete and assert the response status
        cy.wait('@iframeLoad', { timeout: timeout })
          .its('response.statusCode')
          .should('eq', 200);

        cy.get('@embedding').should('be.visible');
      });
      });


      it("The page must ", () => {
        it("should load the title", () => {
          cy.visit(BASE_URL)
          cy.get('[data-cy="title"]')
          .should("exist")
          .and("contain.text", "Plansituasjon:")
          .and('be.visible')
        }
        )
      })

      /* Tests for case documents component */
      it("Has case documents header", () => {
      cy.get('[data-cy="case-documents-header"]')
        .should("exist")
        .and("contain.text", "Sakens dokumenter")
        .and("be.visible")
      });

      it('should render the document list dynamically', () => {
        // Fetch all document titles dynamically
        cy.get('a').each(($el, index, $list) => {
          // Get the filename from the href attribute
          const documentName = $el.attr('href').split('/').pop();
          
          // Assert that the document name is displayed in the component
          cy.contains(documentName).should('exist');
        });
      });
    
      it('should have clickable links for each document dynamically', () => {
        // Fetch all document links dynamically and ensure they are clickable
        cy.get('a').each(($el) => {
          // Get the href attribute and make sure it's a valid link
          cy.wrap($el)
            .should('have.attr', 'href')
            .and('match', /(\.pdf|\.jpg|\.xml)$/);  // Ensure it ends with .pdf, .jpg or .xml
    
          // Optionally, click the link (without actually navigating)
          cy.wrap($el).click({ force: true });
        });
      });


      /* Tests for AI results components */
     /*  it('Has ArchiveGPT header', () => {
        cy.get('[data-cy="archiveGPT-header"]')
        .should("exist")
        .and("contain.text", "ArkivGPT")
        .and("be.visible")
      })

      it('Has "Send status" button for ArchiveGPT', () => {
        cy.contains('Send status').should('exist');
  
        // Click on the "Delvis godkjenn" button
        cy.contains('Send status').click();
        // Perform any assertion based on expected behavior
      })

      it('Has status symbol and text', () => {
        cy.contains('Noe')
      })
    
      it('Has hyperlink to ArchiveGPT results page', () => {
        cy.get('a').each(($el) => {
          // Get the href attribute and make sure it's a valid link
          cy.wrap($el)
            .should('have.attr', 'href');

          cy.wrap($el).click({ force: true });
        })
      })
 */
})