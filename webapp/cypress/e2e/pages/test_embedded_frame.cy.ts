const external_component_url = "https://byggesak3d.norkart.no/view/bf204afe-e50e-4ac6-8839-ebd9406167ac";
const BASE_URL = "http://localhost:3000/";
const PAGE_URL = BASE_URL + "tiltaksvisning";


describe('Iframe Tests', () => {
  beforeEach(() => {
    // Intercept the GET request for the iframe's src URL and alias it as 'iframeLoad'
    cy.intercept('GET', `${external_component_url}*`).as('iframeLoad');

    // Visit the target page after setting up the intercept
    cy.visit(PAGE_URL);
  });

  it('should load the iframe without errors', () => {
    let timeout = 10_000;
    cy.get('[data-cy="tiltaksvisning"]', { timeout: timeout })
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


describe("The page must ", () => {
  it("should load the title", () => {
    cy.visit(PAGE_URL)
    cy.get('[data-cy="title"]')
    .should("exist")
    .and("contain.text", "3D tiltaksvisning")
    .and('be.visible')
  }
  )
})
