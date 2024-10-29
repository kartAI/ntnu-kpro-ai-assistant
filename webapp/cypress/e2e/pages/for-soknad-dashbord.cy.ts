describe("for-soknad-dashbord e2e Tests", () => {
    const ROUTE = "for-soknad/byggideer/dashbord"

    beforeEach(() => {
        cy.visit(`/${ROUTE}`)
    })

    it("should render content", () => {
        cy.contains("#heading").should("be.visible")
        cy.contains("#pick-address").should("be.visible")
        cy.contains("#todo-list").should("be.visible")
        cy.contains("#planprat").should("be.visible")
        cy.contains("#cadaid-widget").should("be.visible")
        cy.contains("#digital-tiltaksdata-widget").should("be.visible")
        cy.contains("#3d-visning-widget").should("be.visible")
        cy.contains("#document-overview").should("be.visible")
        cy.contains("#arkiv-gpt").should("be.visible")
        cy.contains("#start-aplication-button").should("be.visible")
    })
})