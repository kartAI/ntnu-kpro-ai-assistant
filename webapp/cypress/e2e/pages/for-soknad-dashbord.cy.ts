describe("for-soknad-dashbord e2e Tests", () => {
    const ROUTES = ["for-soknad/byggeideer/dashboard", "for-soknad/byggeideer/dashboard"]

    ROUTES.forEach((route) => {
        describe(`Route: ${route}`, () => {
          beforeEach(() => {
            // Visit the UserDashboard page before each test
            cy.visit(`/${route}`);
          });

            it("should render content", () => {
                cy.get('[data-cy="title"').should("be.visible")
                cy.get('[data-cy="pick-address"').should("be.visible")
                cy.get('[data-cy="todo-list"').should("be.visible")
                cy.get('[data-cy="planprat"').should("be.visible")
                cy.get('[data-cy="cadaid-widget"').should("be.visible")
                cy.get('[data-cy="digital-tiltaksdata-widget"').should("be.visible")
                cy.get('[data-cy="3d-visning-widget"').should("be.visible")
                cy.get('[data-cy="document-overview"').should("be.visible")
                cy.get('[data-cy="arkiv-gpt"').should("be.visible")
                cy.get('[data-cy="start-aplication-button"').should("be.visible")
            });

            it("should have navigation to correct cadaid page", () => {
                cy.get('[data-cy="cadaid-widget"').click()
                cy.url().should("eq", route + "cadaid")
            });

            it("should have navigationg to correct arkivGPT page", () => {
                cy.get('[data-cy="arkiv-gpt"').click()
                cy.url().should("eq", route + "arkivgpt")
            })
            
        });
    });
});
