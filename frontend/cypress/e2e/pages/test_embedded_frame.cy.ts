// cypress/e2e/iframe.cy.ts

const external_component_url = "https://byggesak3d.norkart.no/view/bf204afe-e50e-4ac6-8839-ebd9406167ac";
const BASE_URL = "http://localhost:3000/";
const PAGE_URL = BASE_URL + "tiltaksvisning";

describe('Iframe Tests', () => {
  beforeEach(() => {
    cy.visit(PAGE_URL);
  });

  it('should load the iframe without errors', () => {
    // Select the iframe using the correct selector
    cy.get('[data-cy="tiltaksvisning"]')
      .should('exist') 
      .and('have.attr', 'src', external_component_url)
      .and('be.visible')
  });
});
