describe('template spec', () => {
  it('passes', () => {
    cy.visit('localhost:4200/toggle-on-scroll-directive-test');

    cy.get('ks-navbar-container').should('exist');
    cy.get('ks-navbar-container').should(
      'have.class',
      'make-nav-bar-tranparent'
    );
    cy.get('button').should('exist');
    cy.wait(1000); // Wait for the page to load
    cy.scrollTo('bottom', { duration: 1000 });
    cy.get('ks-navbar-container').should(
      'not.have.class',
      'make-nav-bar-tranparent'
    );
    cy.get('ks-navbar-container').should('have.class', 'bg-white');
    cy.get('button').should('be.visible');

    cy.scrollTo('top', { duration: 1000 });
    cy.get('ks-navbar-container').should(
      'have.class',
      'make-nav-bar-tranparent'
    );
  });
});
