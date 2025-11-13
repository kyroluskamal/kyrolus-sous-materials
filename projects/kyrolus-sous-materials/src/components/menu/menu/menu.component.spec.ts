import {
  Component,
  DebugElement,
  provideZonelessChangeDetection,
} from '@angular/core';
import { MenuComponent } from './menu.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

@Component({
  selector: 'ks-menu-header',
  template: `<ng-content />`,
  standalone: true,
})
class FakeMenuHeader {}

@Component({
  selector: 'ks-menu-section',
  template: `<ng-content />`,
  standalone: true,
})
class FakeMenuSection {}

@Component({
  selector: 'ks-menu-item',
  template: `<ng-content />`,
  standalone: true,
})
class FakeMenuItem {}
@Component({
  selector: 'ks-menu-footer',
  template: `<ng-content />`,
  standalone: true,
})
class FakeMenuFooter {}

@Component({
  template: `
    <ks-menu ariaLabel="Test Menu">
      <ks-menu-header>Test Header</ks-menu-header>
      <ks-menu-section>Test Section</ks-menu-section>
      <ks-menu-item>Test Item</ks-menu-item>
      <div ksSeparator></div>
      <ks-menu-footer>Test Footer</ks-menu-footer>
    </ks-menu>
  `,
  standalone: true,
  imports: [
    MenuComponent,
    FakeMenuHeader,
    FakeMenuSection,
    FakeMenuItem,
    FakeMenuFooter,
  ],
})
class TestHostComponent {}
describe('MenuComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let testElement: DebugElement;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    testElement = fixture.debugElement;
    fixture.detectChanges();
  });

  it('1. should project ks-menu-header content', () => {
    const headerEl = testElement.query(By.css('ks-menu-header'));
    expect(headerEl).not.toBeNull();
    expect(headerEl.nativeElement.textContent).toContain('Test Header');
  });

  it('2. should project ks-menu-section content', () => {
    const sectionEl = fixture.debugElement.query(By.css('ks-menu-section'));
    expect(sectionEl).not.toBeNull();
    expect(sectionEl.nativeElement.textContent).toContain('Test Section');
  });

  it('3. should project ks-menu-item content', () => {
    const itemEl = fixture.debugElement.query(By.css('ks-menu-item'));
    expect(itemEl).not.toBeNull();
    expect(itemEl.nativeElement.textContent).toContain('Test Item');
  });

  it('4. should project content with [ksSeparator] attribute', () => {
    const separatorEl = fixture.debugElement.query(By.css('[ksSeparator]'));
    expect(separatorEl).not.toBeNull();
  });

  it('5. should project content with .ks-menu-footer class', () => {
    const footerEl = fixture.debugElement.query(By.css('ks-menu-footer'));
    expect(footerEl).not.toBeNull();
    expect(footerEl.nativeElement.textContent).toContain('Test Footer');
  });

  it('6. should set the aria-label attribute', () => {
    const menuEl = testElement.query(By.css('ks-menu'));
    expect(menuEl.attributes['aria-label']).toBe('Test Menu');
  });

  it('7. should have role attribute set to menu', () => {
    const menuEl = testElement.query(By.css('ks-menu'));
    expect(menuEl.attributes['role']).toBe('menu');
  });

  it('8. should have aria-orientation attribute set to vertical', () => {
    const menuEl = testElement.query(By.css('ks-menu'));
    expect(menuEl.attributes['aria-orientation']).toBe('vertical');
  });
});
