import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuSectionComponent } from './menu-section.component';
import {
  Component,
  DebugElement,
  provideZonelessChangeDetection,
} from '@angular/core';
import { MenuComponent, MenuItemComponent } from '../menu.exports';
import { SeparatorDirective } from '../../../public-api';
import { By } from '@angular/platform-browser';
import { getErrorMessageForMenuItemNotInMenu } from '../menu.const';
@Component({
  selector: 'ks-test-host',
  template: `
    <ks-menu>
      <ks-menu-section [title]="'Test Section'">
        <ks-menu-item>Item 1</ks-menu-item>
        <ks-menu-item>Item 2</ks-menu-item>
        <hr ksSeparator />
      </ks-menu-section>
      <ks-menu-section [title]="'Test Section2'" id="MENU-TEST-SECTION">
        <ks-menu-item>Item 1</ks-menu-item>
        <ks-menu-item>Item 2</ks-menu-item>
        <hr ksSeparator />
      </ks-menu-section>
      <ks-menu-section>
        <ks-menu-item>Item 1</ks-menu-item>
        <ks-menu-item>Item 2</ks-menu-item>
        <hr ksSeparator />
      </ks-menu-section>
    </ks-menu>
  `,
  standalone: true,
  imports: [
    MenuSectionComponent,
    MenuItemComponent,
    MenuComponent,
    SeparatorDirective,
  ],
})
class TestHostComponent {}
describe('MenuSectionComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let debugElement: DebugElement[];
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    debugElement = fixture.debugElement.queryAll(
      By.directive(MenuSectionComponent)
    );
  });

  describe('Component tests', () => {
    it('Should have the correct title', () => {
      const sectionTitle = debugElement[0].nativeElement.querySelector('p');
      expect(sectionTitle.textContent).toBe('Test Section');
    });
    it('Should put the id from the title if no id is provided', () => {
      const sectionTitle = debugElement[0].nativeElement.querySelector('p');
      debugger;
      expect(sectionTitle.textContent).toBe('Test Section');
      expect(sectionTitle.id).toContain('test-section');
    });
    it('Should use the provided id', () => {
      const sectionTitle = debugElement[1].nativeElement.querySelector('p');
      expect(sectionTitle.textContent).toBe('Test Section2');
      expect(sectionTitle.id).toContain('menu-test-section');
      const sectionGroup = debugElement[1].nativeElement.querySelector('div');
      expect(sectionGroup.getAttribute('role')).toBe('group');
      expect(sectionGroup.getAttribute('arialabelledby')).toContain(
        'menu-test-section'
      );
    });
    it('Should throw an error if the parent menu is not provided', () => {
      expect(() => {
        TestBed.createComponent(MenuSectionComponent);
      }).toThrowError(getErrorMessageForMenuItemNotInMenu('Section'));
    });
    it('Should projet separator if present', () => {
      const sectionGroup = debugElement[0].nativeElement.querySelector('div');
      const separator = sectionGroup.querySelector('hr[ksSeparator]');
      expect(separator).toBeTruthy();
    });
  });

  describe('Aria tests', () => {
    it('Should have role none', () => {
      const sectionHost = debugElement[0].nativeElement;
      expect(sectionHost.getAttribute('role')).toBe('none');
    });
    it('Should have title with id', () => {
      const sectionTitle = debugElement[0].nativeElement.querySelector('p');
      expect(sectionTitle.id).toContain('test-section');
    });

    it('Should have role group with aria-labelledby', () => {
      const sectionGroup = debugElement[0].nativeElement.querySelector('div');
      expect(sectionGroup.getAttribute('role')).toBe('group');
      expect(sectionGroup.getAttribute('arialabelledby')).toContain(
        'test-section'
      );
    });
    it('Should not have aria-labelledby if no title or id is provided', () => {
      const sectionGroup = debugElement[2].nativeElement.querySelector('div');
      expect(sectionGroup.getAttribute('arialabelledby')).toBeNull();
    });
  });
});
