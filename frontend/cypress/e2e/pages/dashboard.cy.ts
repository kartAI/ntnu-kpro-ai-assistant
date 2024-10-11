const VALID_CASE_ID = 1;

describe('My First Test', () => {
    it('Visits the Kitchen Sink', () => {
      cy.visit("/mottakskontroll/dine-saker/dashbord/" + VALID_CASE_ID)
    })
  })
  

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
  
})