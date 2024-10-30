describe("for-soknad-dashbord e2e Tests", () => {
    const ROUTE = "for-soknad/byggeideer/dashbord"

    beforeEach(() => {
        cy.visit(`/${ROUTE}`)
    })

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
    })
})