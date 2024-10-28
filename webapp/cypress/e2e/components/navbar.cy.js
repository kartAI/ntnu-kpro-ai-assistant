describe('Navbar Dropdown', () => {
    beforeEach(() => {
      // Visit the page where your navbar component is rendered
      cy.visit('/');
    });
  
    it('should open the dropdown when clicked', () => {
      // Open the dropdown
      cy.get('[data-cy="dropdown-button-1"]').click(); // Adjust the selector based on your implementation
  
      // Check if the dropdown content is visible
      cy.get('[data-cy="dropdown-content"]').should('be.visible');
    });
  
    it('should close the dropdown when clicked again', () => {
      // Open the dropdown
      cy.get('[data-cy="dropdown-button-1"]').click(); 
  
      // Close the dropdown
      cy.get('[data-cy="dropdown-button-1"]').click(); 
  
      // Check if the dropdown content is not visible
      cy.get('[data-cy="dropdown-content"]').should('not.exist');
    });
  
    it('should close dropdown when clicking outside', () => {
      // Open the dropdown
      cy.get('[data-cy="dropdown-button-1"]').click(); 
  
      // Click outside of the dropdown
      cy.get('body').click(50, 50, { force: true}); 
  
      // Check if the dropdown content is not visible
      cy.get('[data-cy="dropdown-content"]').should('not.exist');
    });
  
    it('should allow navigation by clicking on links', () => {
      // Open the dropdown
      cy.get('[data-cy="dropdown-button-0"]').click(); 
  
      // Click on a link
      cy.get('[data-cy="dropdown-content"]')
        .contains('Tiltakskart') // Replace with actual link text
        .click();
  
      // Verify navigation to the correct URL
      cy.url().should('include', '/for-soknad/tiltakskart'); // Replace with the expected URL
    });
  });