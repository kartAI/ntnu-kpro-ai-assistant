const BASE_URL = "http://localhost:3000"
describe('Landing page', () => {
  it('should load the landing page successfully', () => {
    cy.visit(BASE_URL + "/"); 
    cy.url().should("eq", BASE_URL + "/")
  });
});

describe("Make sure landing page is visitable/ displays data properly", () => {
    beforeEach(() => {
        cy.visit(BASE_URL + "/")
    })

    it("test landingpage has navigation bar", () => {
      cy.contains("Før Søknad")
      cy.contains("Under Søknad")
      cy.contains("Mottakskontroll")
    })

    it("landing page has welcoming paragraph", () => {
      cy.get("#welcome-text").should("be.visible")
    })

    it("landing page has image", () => {
      cy.get("#homepage-picture").should("be.visible")
    })
});

describe("Make sure navbar on landing page get you to intended target", () => {
  beforeEach(() => {
    cy.visit(BASE_URL + "/")
  })

  it("test før søknad", () => {
    cy.contains("Før Søknad").click();
    cy.url().should("eq", BASE_URL +"/bygget")
  })

  it("test under søknad", () => {
    cy.contains("Under Søknad").click();
    cy.url().should("eq", BASE_URL + "/soknad")
  })

  it("test Mottakskontroll", () => {
    cy.contains("Mottakskontroll").click();
    cy.url().should("eq", BASE_URL + "/admin")
  })
})






