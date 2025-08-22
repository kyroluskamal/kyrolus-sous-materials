import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonDirective } from '../../directives/button/button.directive';
import {
  provideZonelessChangeDetection,
  Component,
  signal,
  DebugElement,
} from '@angular/core';
import { By } from '@angular/platform-browser';
import { IconDirective } from '../../directives/icon/icon.directive';
import { MenuModule } from '../../components/menu/menu-module';
import { PopoverMenuBlock } from './popover-menu.block';
import {
  IMenuItem,
  IMenuSection,
  KsMenu,
} from '../../components/menu/menu.types';
import { ToggleButtonDirective } from '../../directives/toggle-button/toggle-button.directive';
import { MenuHeaderComponent } from '../../components/menu/menu-header/menu-header.component';
import { MenuFooterComponent } from '../../components/menu/menu-footer/menu-footer.component';
import { MenuSectionComponent } from '../../components/menu/menu-section/menu-section.component';
import { MenuItemComponent } from '../../components/menu/menu-item/menu-item.component';
import { MenuComponent } from '../../components/menu/menu/menu.component';
import { SeparatorDirective } from '../../public-api';
import { query } from '@angular/animations';
@Component({
  selector: 'app-popover-menu-tests',
  imports: [PopoverMenuBlock, MenuModule, IconDirective],
  template: `
    <ks-popover-menu
      [isOpen]="true"
      [ksMenu]="menuItems"
      placement="left-start"
      [(isOpen)]="isOpen"
      [toggleButtonTemplate]="toggleButton"
    >
      <ng-template #toggleButton>
        <button #toggleButton id="customBtn" (click)="isOpen.set(!isOpen())">
          Toggle
        </button>
      </ng-template>
      <ks-menu-header useSeparator decorativeSeparator>
        <span ksIcon="home"> </span>
        <p>Coding Bible Menu</p>
      </ks-menu-header>
      <ks-menu-section title="Document section">
        <ks-menu-item><p>new item test</p></ks-menu-item>
        <ks-menu-item><p>new item test2</p></ks-menu-item>
      </ks-menu-section>
      <ks-menu-item>
        <span ksIcon="search"></span>
        <p>Search2</p>
      </ks-menu-item>
      <ks-menu-item>
        <span ksIcon="settings"></span>
        <p>Settings2</p>
      </ks-menu-item>
      <ks-menu-footer useSeparator decorativeSeparator>
        <span ksIcon="home"> </span>
        <p>Coding Bible Menu</p>
      </ks-menu-footer>
    </ks-popover-menu>
    <ks-popover-menu
      [isOpen]="true"
      [ksMenu]="menuItems"
      placement="left-start"
      [(isOpen)]="isOpen"
    >
    </ks-popover-menu>
  `,
  host: {
    class:
      'd-block h-100vh bg-grey-39 d-flex align-items-center justify-content-center flex-wrap-wrap',
  },
})
export class PopoverMenuTests {
  readonly isOpen = signal(true);
  menuItems = new KsMenu(
    [
      {
        title: 'Document section',
        id: 'test-section',
        classes: 'test-section',
        items: [
          {
            id: 'new-item-1',
            disabled: true,
            icon: 'plus-lg',
            label: 'New',
            classes: 'new-item-classes',
            action: (event, itemRef) => {
              console.log('New item clicked', event, itemRef);
            },
            iconOptions: { provider: 'bi' },
          },
          {
            icon: 'search',
            label: 'Search',
            routerLink: '/tests',
          },
        ],
      },
      {
        icon: 'settings',
        label: 'Settings',
        action: (event, itemRef) => {
          console.log('New item clicked');
        },
        classes: 'custom-item-classes',
      },
      { icon: 'settings', label: 'Logout' },
      { separator: true, isDecorative: true },
      { icon: 'add', label: 'leeg', href: '/tests' },
    ],
    {
      iconOptions: {
        provider: 'google',
        options: { type: 'outlined' },
      },
      menuClasses: 'menu-classes menu01',
      itemClasses: 'item-classes item01',
      separatorClasses: 'separator-classes separator01',
    },
    {
      size: 'md',
      variant: 'text',
      appearance: 'dark',
      isRaised: true,
      borderRadius: 'br-r-2',
      shape: 'circle',
      disabled: false,
      iconOptions: {
        provider: 'google',
        options: { type: 'outlined' },
      },
      iconName: 'menu',
      RaisedClass: 'raised',
      id: `menu-button-${Math.random().toString(36).substring(2, 15)}`,
    },
    {
      size: 'md',
      variant: 'text',
      appearance: 'dark',
      isRaised: true,
      borderRadius: 'br-r-2',
      shape: 'default',
      RaisedClass: 'raised',
      id: `menu-item-button-${Math.random().toString(36).substring(2, 15)}`,
    }
  );
}

describe('PopoverMenuBlock', () => {
  let PopOverMenucomponent: PopoverMenuBlock[];
  let fixture: ComponentFixture<PopoverMenuTests>;
  let debugElement: DebugElement[];
  let toggleButton: DebugElement;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopoverMenuTests, NoopAnimationsModule],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(PopoverMenuTests);
    debugElement = fixture.debugElement.queryAll(
      By.directive(PopoverMenuBlock)
    );
    fixture.detectChanges();
    await fixture.whenStable();
    PopOverMenucomponent = debugElement.map(
      (de) => de.componentInstance as PopoverMenuBlock
    );
    toggleButton = debugElement[1].query(By.directive(ToggleButtonDirective));
  });

  describe('1. Template tests', () => {
    it('1.1. Should not have <ks-menu> if isOpen is false', async () => {
      const hostElement = fixture.componentInstance;
      hostElement.isOpen.set(false);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(hostElement.isOpen()).toBeFalsy();
      expect(debugElement[0].query(By.css('ks-menu'))).toBeNull();
    });
    it('1.2. Should have <ks-menu> if isOpen is true', async () => {
      const hostElement = fixture.componentInstance;
      hostElement.isOpen.set(true);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(hostElement.isOpen()).toBeTruthy();
      expect(debugElement[0].query(By.css('ks-menu'))).not.toBeNull();
    });

    it('1.3. Should have the default toggle button if toggleButtonTemplate is not provided', () => {
      expect(toggleButton).not.toBeNull();
      expect(PopOverMenucomponent[1].toggleButton()).not.toBeNull();
    });
    it('1.4. Should project header', () => {
      const header = debugElement[0].query(By.directive(MenuHeaderComponent));
      expect(header).not.toBeNull();
      const headerText = header.nativeElement.querySelector('p');
      expect(headerText).not.toBeNull();
      expect(headerText.textContent).toBe('Coding Bible Menu');
    });
    it('1.5. Should project footer', () => {
      const header = debugElement[0].query(By.directive(MenuFooterComponent));
      expect(header).not.toBeNull();
      const headerText = header.nativeElement.querySelector('p');
      expect(headerText).not.toBeNull();
      expect(headerText.textContent).toBe('Coding Bible Menu');
    });
    it('1.6. Should project menu section and it sitems', () => {
      const section = debugElement[0].query(By.directive(MenuSectionComponent));
      expect(section).not.toBeNull();
      const item = section.queryAll(By.directive(MenuItemComponent));
      expect(item[0].nativeElement.textContent).toContain('New');
      expect(item[1].nativeElement.textContent).toContain('Search');
      expect(item).not.toBeNull();
    });
    it('1.7. Should project menu Items if menuConfig is provided', () => {
      const items = debugElement[0].queryAll(By.directive(MenuItemComponent));
      expect(items[0].nativeElement.textContent).toContain('New');
      expect(items[1].nativeElement.textContent).toContain('Search');
      expect(items[2].nativeElement.textContent).toContain('Settings');
      expect(items[3].nativeElement.textContent).toContain('Logout');
      expect(items[4].nativeElement.textContent).toContain('leeg');
    });
    it('1.8. Should project menu section and items even if menuConfig is provided', () => {
      const section = debugElement[0].queryAll(
        By.directive(MenuSectionComponent)
      )[1];
      expect(section).not.toBeNull();
      const item = section.queryAll(By.directive(MenuItemComponent));
      const AllItems = debugElement[0].queryAll(
        By.directive(MenuItemComponent)
      );
      expect(AllItems.length).toBeGreaterThan(0);
      expect(item[0].nativeElement.textContent).toContain('new item test');
      expect(item[1].nativeElement.textContent).toContain('new item test2');
      expect(AllItems[7].nativeElement.textContent).toContain('Search2');
      expect(AllItems[8].nativeElement.textContent).toContain('Settings2');
    });

    it('1.9 Should have the host class "position-relative d-inline-block"', () => {
      const hostElement = debugElement[0].nativeElement as HTMLElement;
      expect(Array.from(hostElement.classList)).to.include.members([
        'position-relative',
        'd-inline-block',
      ]);
    });
  });

  describe('2. Input tests', () => {
    it('2.1 Should have custom if toggleButtonTemplate is provided', () => {
      const customBtn =
        debugElement[0].nativeElement.querySelector('#customBtn');
      expect(customBtn).not.toBeNull();
    });
    describe('11.2 ksMenu input', () => {
      it('2.2.1 Should have ksMenu input', () => {
        expect(PopOverMenucomponent[0].ksMenu()).toBeInstanceOf(KsMenu);
      });
      it('2.2.2 Should apply the default iconOptions if no iconOptions is provided in the menuItem', () => {
        const mwnuItemsConfig = fixture.componentInstance.menuItems;
        expect(
          (mwnuItemsConfig.menuConfig[0] as IMenuSection).items[1].iconOptions
        ).toBeUndefined();
        const useTheDefautlGoogleIcon_Outlined = debugElement[0]
          .queryAll(By.directive(MenuItemComponent))[1]
          .nativeElement.querySelector('.material-icons-outlined');
        expect(useTheDefautlGoogleIcon_Outlined).not.toBeNull();
      });
      it('2.2.3 Should apply the iconOptions provided in the menuItem', () => {
        const mwnuItemsConfig = fixture.componentInstance.menuItems;
        expect(
          (mwnuItemsConfig.menuConfig[0] as IMenuSection).items[0].iconOptions
        ).toEqual({ provider: 'bi' });
        const useTheBiIcon = debugElement[0]
          .queryAll(By.directive(MenuItemComponent))[0]
          .nativeElement.querySelector('.bi-plus-lg');
        expect(useTheBiIcon).not.toBeNull();
      });
      it('2.2.4 Should apply the custom classes for menu, item and separator', () => {
        const menu = debugElement[0].query(By.directive(MenuComponent))
          .nativeElement as HTMLElement;
        const menuItem = debugElement[0].query(By.directive(MenuItemComponent))
          .nativeElement as HTMLElement;
        const separator = debugElement[0].query(
          By.directive(SeparatorDirective)
        ).nativeElement as HTMLElement;
        expect(Array.from(menu.classList)).toContain('menu-classes');
        expect(Array.from(menuItem.classList)).toContain('item-classes');
        expect(Array.from(separator.classList)).toContain('separator-classes');
      });
      it('2.2.5 Should be able to set the toggleButtonConfig', () => {
        const toggleButtonConfig = debugElement[1].query(
          By.directive(ToggleButtonDirective)
        ).nativeElement as HTMLElement;
        const classes = Array.from(toggleButtonConfig.classList);
        expect(classes).to.include.members([
          'btn',
          'btn-circle',
          'btn-md',
          'btn-text-dark',
          'raised',
          'br-r-2',
          'material-icons-outlined',
        ]);
        expect(toggleButtonConfig.textContent).toBe('menu');
        expect(toggleButtonConfig.getAttribute('aria-hidden')).toBeNull();
      });
      it('2.2.6 Should apply the default buttonConfig of the menuitems', () => {
        const menuItemBtn = debugElement[1]
          .queryAll(By.directive(MenuItemComponent))[0]
          .query(By.directive(ButtonDirective)).nativeElement as HTMLElement;
        expect(menuItemBtn).not.toBeNull();
        const classes = Array.from(menuItemBtn.classList);
        expect(classes).to.include.members([
          'btn',
          'btn-default',
          'btn-md',
          'btn-text-dark',
          'raised',
          'br-r-2',
        ]);
        expect(menuItemBtn.textContent).toBe('New');
        expect(menuItemBtn.getAttribute('aria-hidden')).toBeNull();
        expect(menuItemBtn.getAttribute('id')).toEqual(
          PopOverMenucomponent[1].ksMenu().menuItemButtonConfig.id
        );
      });
      it('2.2.7 Should apply the custom iconConfig in the toggleButton if no iconOptions are provided in the toggleButtonConfig', () => {
        const toggleButtonIcon = debugElement[1].query(
          By.directive(ToggleButtonDirective)
        ).nativeElement as HTMLElement;
        expect(toggleButtonIcon).not.toBeNull();
        expect(toggleButtonIcon.classList).toContain('material-icons-outlined');
        expect(toggleButtonIcon.textContent).toBe('menu');
      });
      describe('2.2.8 MenuItemConfig inputs', () => {
        it('11.2.8.1 Should be able to set menuSection with title, classes, id and items', () => {
          const menuSection = debugElement[0].query(
            By.directive(MenuSectionComponent)
          ).nativeElement as HTMLElement;
          expect(menuSection).not.toBeNull();
          expect(menuSection.querySelector('span')?.textContent).toBe(
            (PopOverMenucomponent[0].ksMenu().menuConfig[0] as IMenuSection)
              .title
          );
          expect(menuSection.getAttribute('class')).toContain(
            (PopOverMenucomponent[0].ksMenu().menuConfig[0] as IMenuSection)
              .classes
          );
          expect(menuSection.getAttribute('id')).toContain(
            (PopOverMenucomponent[0].ksMenu().menuConfig[0] as IMenuSection).id
          );
        });
        it('11.2.8.2 Should able to set the id on the menu item ', () => {
          const menuItem = debugElement[1].queryAll(
            By.directive(MenuItemComponent)
          )[0].nativeElement as HTMLElement;
          expect(menuItem.getAttribute('id')).toEqual(
            (PopOverMenucomponent[1].ksMenu().menuConfig[0] as IMenuSection)
              .items[0].id
          );
        });
        it('11.2.8.3 Should be able to set the disabled on the menu item ', () => {
          const menuItem = debugElement[1]
            .queryAll(By.directive(MenuItemComponent))[0]
            .query(By.directive(ButtonDirective)).nativeElement as HTMLElement;
          expect(menuItem.getAttribute('disabled')).toBeTruthy();
        });
        it('11.2.8.4 Should be able to set the icon on the menu item ', () => {
          const menuItem = debugElement[1]
            .queryAll(By.directive(MenuItemComponent))[0]
            .query(By.directive(IconDirective)).nativeElement as HTMLElement;
          expect(menuItem.classList).toContain('bi-plus-lg');
        });
        it('11.2.8.5 Should be able to set the label on the menu item ', () => {
          const menuItem = debugElement[1]
            .queryAll(By.directive(MenuItemComponent))[0]
            .query(By.css('p')).nativeElement as HTMLElement;
          expect(menuItem.textContent).toBe('New');
        });
        it('11.2.8.6 Should not triger action if disabled is true ', () => {
          const menuItem = debugElement[1]
            .queryAll(By.directive(MenuItemComponent))[0]
            .query(By.directive(ButtonDirective)).nativeElement as HTMLElement;
          const actionSpy = vi.spyOn(
            (PopOverMenucomponent[1].ksMenu().menuConfig[0] as IMenuSection)
              .items[0],
            'action'
          );
          menuItem.click();
          expect(actionSpy).not.toHaveBeenCalled();
        });
        it('11.2.8.7 Should triger action if disabled is false ', () => {
          const menuItem = debugElement[1]
            .queryAll(By.directive(MenuItemComponent))[2]
            .query(By.directive(ButtonDirective)).nativeElement as HTMLElement;
          const actionSpy = vi.spyOn(
            PopOverMenucomponent[1].ksMenu().menuConfig[1] as IMenuItem,
            'action'
          );
          menuItem.click();
          expect(actionSpy).toHaveBeenCalled();
        });
        it('11.2.8.8 Should be able to set the routerLink on the menu item ', () => {
          const menuItem = debugElement[1]
            .queryAll(By.directive(MenuItemComponent))[1]
            .query(By.directive(ButtonDirective)).nativeElement as HTMLElement;
          expect(menuItem.getAttribute('routerLink')).toBe('/tests');
        });
        it('11.2.8.9 Should be able to set the href on the menu item ', () => {
          const menuItem = debugElement[1]
            .queryAll(By.directive(MenuItemComponent))[4]
            .query(By.directive(ButtonDirective)).nativeElement as HTMLElement;
          expect(menuItem.getAttribute('href')).toBe('/tests');
        });
        it('11.2.8.10 Should be able to set the classes on the menu item ', () => {
          const menuItem = debugElement[1].queryAll(
            By.directive(MenuItemComponent)
          )[0].nativeElement as HTMLElement;
          expect(menuItem.classList).toContain('new-item-classes');
        });
      });
    });
  });

  describe('3. placement adjustment tests', () => {
    it('3.1. should adjust the placement of the menu if the placement is set to left or right', () => {
      const placement = PopOverMenucomponent[1].placement.set('left');
      fixture.detectChanges();
      const menuComponent = debugElement[1].query(By.directive(MenuComponent))
        .nativeElement as HTMLElement;
      const toggleButton = debugElement[1].query(
        By.directive(ToggleButtonDirective)
      ).nativeElement as HTMLElement;
      Object.defineProperty(toggleButton, 'offsetWidth', { value: 100 });
      Object.defineProperty(menuComponent, 'offsetWidth', { value: 50 });
      //@ts-expect-error
      PopOverMenucomponent[1].adjusePlacement();
      expect(menuComponent).not.toBeNull();
      expect(menuComponent.style.top).toEqual(
        `${toggleButton.offsetWidth / 2 - menuComponent.offsetWidth / 2}px`
      );
    });
    it('3.2. should adjust the placement of the menu if the placement is set to top or bottom', () => {
      const placement = PopOverMenucomponent[1].placement.set('top');
      fixture.detectChanges();
      const menuComponent = debugElement[1].query(By.directive(MenuComponent))
        .nativeElement as HTMLElement;
      const toggleButton = debugElement[1].query(
        By.directive(ToggleButtonDirective)
      ).nativeElement as HTMLElement;
      Object.defineProperty(toggleButton, 'offsetHeight', { value: 100 });
      Object.defineProperty(menuComponent, 'offsetHeight', { value: 50 });
      //@ts-expect-error
      PopOverMenucomponent[1].adjusePlacement();
      expect(menuComponent).not.toBeNull();
      expect(menuComponent.style.left).toEqual(
        `${toggleButton.offsetHeight / 2 - menuComponent.offsetHeight / 2}px`
      );
    });
  });

  describe('4. Document click tests', () => {
    it('4.1. Should close the menu if clicked outside', () => {
      PopOverMenucomponent[0].isOpen.set(true);
      fixture.detectChanges();
      document.body.click();
      expect(PopOverMenucomponent[0].isOpen()).toBeFalsy();
    });
  });

  describe('5. Aria tests', () => {
    it('5.1. Should have the toggle button with with aria-controls attribute set to the menu id', () => {
      const toggleButtonElement =
        PopOverMenucomponent[0].customToggleButtonTemplate()
          ?.nativeElement as HTMLElement;
      expect(
        toggleButtonElement.children[0].getAttribute('aria-controls')
      ).toBe(PopOverMenucomponent[0].ariaMenuid);
      expect(toggleButton.nativeElement.getAttribute('aria-controls')).toBe(
        PopOverMenucomponent[1].ariaMenuid
      );
    });
    it('5.2. Should not have aria-hidden attribute on the toggle button', () => {
      const toggleButtonElement = debugElement[1].query(
        By.directive(ToggleButtonDirective)
      ).nativeElement as HTMLElement;
      expect(toggleButtonElement.getAttribute('aria-hidden')).toBeNull();
    });
    it('5.3 Should have the popover-menu with role="none"', () => {
      const popoverMenuElement = debugElement[0].nativeElement as HTMLElement;
      expect(popoverMenuElement.getAttribute('role')).toBe('none');
    });
  });
});
