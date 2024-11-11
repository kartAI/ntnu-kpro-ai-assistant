describe("for-soknad-dashbord e2e Tests", () => {
    const ROUTES = ["for-soknad/byggeideer/dashboard", "for-soknad/byggeideer/dashboard"]

    ROUTES.forEach((route) => {
        describe(`Route: ${route}`, () => {
          beforeEach(() => {
            // Visit the UserDashboard page before each test
            cy.visit(`/${route}`);
            cy.clearLocalStorage();
          });

            it("should render content", () => {
                cy.get('[data-cy="title"]').should("be.visible");
                cy.get('[data-cy="pick-address"]').should("be.visible");
                cy.get('[data-cy="todo-list"]').should("be.visible");
                cy.get('[data-cy="planprat"]').should("be.visible");
                cy.get('[data-cy="cadaid-widget"]').should("be.visible");
                cy.get('[data-cy="digital-tiltaksdata-widget"]').should("be.visible");
                cy.get('[data-cy="3d-visning-widget"]').should("be.visible");
                cy.get('[data-cy="document-overview"]').should("be.visible");
                cy.get('[data-cy="arkiv-gpt"]').should("be.visible");
                cy.get('[data-cy="start-aplication-button"]').should("be.visible");
            });

            it("should have navigation to correct cadaid page", () => {
                cy.get('[data-cy="cadaid-widget"]').click();
                cy.url().should("eq", route + "cadaid");
            });

            it("should have navigationg to correct arkivGPT page", () => {
                cy.get('[data-cy="arkiv-gpt"]').click();
                cy.url().should("eq", route + "arkivgpt");
            })

            it("should be able to open and close pick address overlay whitout changing anyting", () => {
                cy.contains("Ingen addresse valgt").should("be.visible");
                cy.contains("Ingen tomt valgt").should("be.visible");
                cy.contains("Velg adresse og eiendom").click();
                cy.get('[data-cy="overlay-cancel-button"]')
                cy.get('[data-cy="pick-address-overlay"]').should("not.exist");
                cy.contains("Ingen addresse valgt").should("be.visible");
                cy.contains("Ingen tomt valgt").should("be.visible");
            })

            it("should be able to choose adress and property", () => {
                cy.contains("Ingen addresse valgt").should("be.visible");
                cy.contains("Ingen tomt valgt").should("be.visible");
                cy.contains("Velg adresse og eiendom").click();
                cy.get('[data-cy="pick-address-overlay"]').should("be.visible")
                cy.get('[data-cy="input-address"]').clear().type('TestAdresse');
                cy.get('[data-cy="input-bnr"]').clear().type('TestBnr');
                cy.get('[data-cy="input-gnr"]').clear().type('TestGnr');
                cy.get('[data-cy="overlay-confirm-button"').click();
                cy.contains("TestAdresse").should("be.visible");
                cy.contains("Gnr. TestGnr, Bnr. TestBnr").should("be.visible")
            })

            it("should be able to close popup for analyze build area without any data being saved to local storage", () => {
                cy.get('[data-cy="digital-tiltaksdata-widget"]').click();
                cy.get('[data-cy="cancel-3d-widget"]').click();
                cy.window().then((window) => {
                    const data = window.localStorage.getItem('hasInputDigitalTiltaksdataWidget');
                    cy.wrap(data).should('be.null');
                }); 
            })

            it("should be able to pick building area and receive feedback", () => {
                cy.get('[data-cy="map-feedback"]').should("not.exist");
                cy.get('[data-cy="digital-tiltaksdata-widget"]').click();
                cy.get('[data-cy="mock-map"]').click();
                cy.get('[data-cy="map-feedback"]').should("be.visible");
            })

            it("should be able to go in and out of 3d widget witout any data being saved", () => {
                cy.get('[data-cy="3d-visning-widget"]').click();
                cy.get('[data-cy="cancel-3d-widget"]').click();
                cy.window().then((window) => {
                    const dataURL = window.localStorage.getItem('url');
                    cy.wrap(dataURL).should('be.null');
                });          
            })

            it('"Gjøremål" should change accoring to actions taken by user', () => {
                cy.get('[data-cy="address-text"]').should("be.visible");
                cy.get('[data-cy="cadaid-text"]').should("be.visible");
                cy.get('[data-cy="digital-tilraksdata-text"]').should("be.visible");
                cy.get('[data-cy="three-d-visning-text"]').should("be.visible");
                cy.get('[data-cy="planprat-text"]').should("be.visible");
                cy.get('[data-cy="cadaid-widget"]').click();
                cy.visit(`/${route}`);
                cy.get('[data-cy="cadaid-text"]').should('not.exist');
                cy.contains("Velg adresse og eiendom").click();
                cy.get('[data-cy="input-address"]').clear().type('TestAdresse');
                cy.get('[data-cy="input-bnr"]').clear().type('TestBnr');
                cy.get('[data-cy="input-gnr"]').clear().type('TestGnr');
                cy.get('[data-cy="overlay-confirm-button"').click();
                cy.get('[data-cy="address-text"]').should("not.exist");
                cy.get('[data-cy="arkivgpt-text"]').should("be.visible");
                cy.get('[data-cy="3d-visning-widget"]').click();
                cy.get('[data-cy="apply-3d-url-button"]').click();
                cy.get('[data-cy="three-d-visning-text"]').should("not.exist");
                cy.get('[data-cy="digital-tiltaksdata-widget"]').click();
                cy.get('[data-cy="mock-map"]').click();
                cy.get('[data-cy="digital-tilraksdata-text"]').should("not.exist");
            })



        });
    });
});
