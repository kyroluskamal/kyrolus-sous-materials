describe("Visual baseline", () => {
  const pages = [
    { name: "tests", path: "/tests" },
    { name: "menu-test", path: "/tests/menu-test" },
    { name: "popover-menu", path: "/tests/popover-menu-tests" },
  ];

  pages.forEach(({ name, path }) => {
    it(`captures ${name}`, () => {
      cy.viewport(1280, 720);
      cy.visit(path);
      cy.get("body").should("be.visible");
      cy.wait(300);
      cy.screenshot(`baseline-${name}`);
    });
  });
});
