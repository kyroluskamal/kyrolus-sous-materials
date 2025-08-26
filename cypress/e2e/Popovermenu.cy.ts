describe('template spec', () => {
  it('menu should be in the middle of the button if the poosition is left ', () => {
    cy.visit('http://localhost:4200/tests/popover-menu-tests');
    cy.wait(1000);
    cy.get('#left').within(() => {
      cy.get('button[ksToggleButton]').as('button');
      cy.get('ks-menu').as('menu');
    });
    cy.get('@button').then(($button) => {
      const buttonEl = $button[0];
      const buttonHeight = buttonEl.offsetHeight;
      return cy.get('@menu').then(($menu) => {
        const menuEl = $menu[0];
        return { buttonHeight, menuEl };
      });
    }).then(({ buttonHeight, menuEl }) => {
      const menuHeight = menuEl.offsetHeight;
      const menuTop = parseFloat(getComputedStyle(menuEl).top.replace('px', ''));
      const expectedTop = buttonHeight / 2 - menuHeight / 2;
      expect(menuTop).to.eq(expectedTop);
    });
  });

  it('menu should be in the middle of the button if the poosition is right ', () => {
    cy.visit('http://localhost:4200/tests/popover-menu-tests');
    cy.wait(1000);
    cy.get('#right').within(() => {
      cy.get('button[ksToggleButton]').as('button');
      cy.get('ks-menu').as('menu');
    });
    cy.get('@button').then(($button) => {
      const buttonEl = $button[0];
      const buttonHeight = buttonEl.offsetHeight;
      return cy.get('@menu').then(($menu) => {
        const menuEl = $menu[0];
        return { buttonHeight, menuEl };
      });
    }).then(({ buttonHeight, menuEl }) => {
      const menuHeight = menuEl.offsetHeight;
      const menuTop = parseFloat(getComputedStyle(menuEl).top.replace('px', ''));
      const expectedTop = buttonHeight / 2 - menuHeight / 2;
      expect(menuTop).to.eq(expectedTop);
    });
  });

  it('menu should be in the middle of the button if the poosition is top ', () => {
    cy.visit('http://localhost:4200/tests/popover-menu-tests');
    cy.wait(1000);
    cy.get('#top').within(() => {
      cy.get('button[ksToggleButton]').as('button');
      cy.get('ks-menu').as('menu');
    });
    cy.get('@button').then(($button) => {
      const buttonEl = $button[0];
      const buttonWidth = buttonEl.offsetWidth;
      return cy.get('@menu').then(($menu) => {
        const menuEl = $menu[0];
        return { buttonWidth, menuEl };
      });
    }).then(({ buttonWidth, menuEl }) => {
      const menuWidth = menuEl.offsetWidth;
      const menuLeft = parseFloat(getComputedStyle(menuEl).left.replace('px', ''));
      const expectedLeft = buttonWidth / 2 - menuWidth / 2;
      expect(menuLeft).to.eq(expectedLeft);
    });
  });

  it('menu should be in the middle of the button if the poosition is bottom ', () => {
    cy.visit('http://localhost:4200/tests/popover-menu-tests');
    cy.wait(1000);
    cy.get('#bottom').within(() => {
      cy.get('button[ksToggleButton]').as('button');
      cy.get('ks-menu').as('menu');
    });
    cy.get('@button').then(($button) => {
      const buttonEl = $button[0];
      const buttonWidth = buttonEl.offsetWidth;
      return cy.get('@menu').then(($menu) => {
        const menuEl = $menu[0];
        return { buttonWidth, menuEl };
      });
    }).then(({ buttonWidth, menuEl }) => {
      const menuWidth = menuEl.offsetWidth;
      const menuLeft = parseFloat(getComputedStyle(menuEl).left.replace('px', ''));
      const expectedLeft = buttonWidth / 2 - menuWidth / 2;
      expect(menuLeft).to.eq(expectedLeft);
    });
  });
});
