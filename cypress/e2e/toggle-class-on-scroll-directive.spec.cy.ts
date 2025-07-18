import { ScrollPosition } from '../enums';

const navbar = 'ks-navbar-container';
const navbarClass = 'make-nav-bar-tranparent';
describe('template spec', () => {
  it('Toggle on scroll directive should toggle class on scroll', () => {
    cy.visit('localhost:4200/toggle-on-scroll-directive-test');

    cy.get(navbar).should((nb) => {
      expect(nb).to.exist;
    });
    cy.get(navbar).should((nb) => {
      expect(nb).to.have.class(navbarClass);
    });
    cy.wait(1000);
    cy.scrollTo(ScrollPosition.BOTTOM, { duration: 1000 });
    cy.get(navbar).should((nb) => {
      expect(nb).to.have.class(navbarClass);
    });
    cy.get('button').should((btn) => {
      expect(btn).to.be.visible();
    });
    cy.scrollTo(ScrollPosition.TOP, { duration: 1000 });
    cy.get(navbar).should((nb) => {
      expect(nb).to.have.class(navbarClass);
    });
  });
});
