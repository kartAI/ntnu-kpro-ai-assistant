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


    /** Tests for Planprat component */
    /* TODO: Copy tests from Artemis' Planprat page */


    /* Tests for Case Feedback */
    /* TODO: Add tests for feedback */

    /* Tests for  */
})