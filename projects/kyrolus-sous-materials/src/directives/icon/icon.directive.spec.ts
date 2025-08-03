import {
  Component,
  DebugElement,
  provideZonelessChangeDetection,
} from '@angular/core';
import { IconDirective } from './icon.directive';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
// type: 'normal' | 'round' | 'outlined' | 'sharp' | 'two-tone';
@Component({
  selector: 'app-tests',
  imports: [IconDirective],
  template: `
    <button
      ksButton
      size="sm"
      ksIcon="home"
      [iconOptions]="{
        provider: 'google'
      }"
    >
      hhh
    </button>

    <button
      ksButton
      size="sm"
      ksIcon="home"
      [iconOptions]="{
        provider: 'google',
        options: {
          type: 'round',
        },
      }"
    ></button>

    <button
      ksButton
      size="sm"
      ksIcon="home"
      [iconOptions]="{
        provider: 'google',
        options: {
          type: 'outlined',
        },
      }"
    ></button>

    <button
      ksButton
      size="sm"
      ksIcon="home"
      [iconOptions]="{
        provider: 'google',
        options: {
          type: 'sharp',
        },
      }"
    ></button>

    <button
      ksButton
      size="sm"
      ksIcon="home"
      [iconOptions]="{
        provider: 'google',
        options: {
          type: 'two-tone',
        },
      }"
    ></button>
  `,
})
export class GoogleIconTests {}

@Component({
  selector: 'app-tests',
  imports: [IconDirective],
  template: `
    <span ksIcon="0-circle-fill" [iconOptions]="{ provider: 'bi' }">Home</span>
  `,
})
export class BootstraIconTests {}

describe('IconDirective', () => {
  describe('Google Icon', () => {
    let fixture: ComponentFixture<GoogleIconTests>;
    let testElement: DebugElement[];

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [IconDirective],
        providers: [provideZonelessChangeDetection()],
      }).createComponent(GoogleIconTests);

      fixture = TestBed.createComponent(GoogleIconTests);
      testElement = fixture.debugElement.queryAll(By.directive(IconDirective));

      fixture.detectChanges();
    });
    async function getFontFamily(index: number): Promise<string> {
      fixture.detectChanges();
      await fixture.whenStable();
      const styles = window.getComputedStyle(testElement[index].nativeElement);
      debugger;
      return styles.fontFamily;
    }
    it('Normal Google Icon should have the correct class "Material Icons"', () => {
      expect(
        testElement[0].nativeElement.classList.contains('material-icons')
      ).toBeTrue();
    });
    it('should have aria-hidden set to true', () => {
      expect(testElement[0].nativeElement.getAttribute('aria-hidden')).toBe(
        'true'
      );
    });
    it('Normal Google Icon should have the font family "Material Icons"', async () => {
      expect(await getFontFamily(0)).toBe('"Material Icons"');
    });
    it('Normal Google Icon should have be the default if the type is not provided', async () => {
      expect(await getFontFamily(0)).toBe('"Material Icons"');
    });
    it('Round Google Icon should have the correct class "Material Icons Round"', () => {
      expect(
        testElement[1].nativeElement.classList.contains('material-icons-round')
      ).toBeTrue();
    });
    it('Round Google Icon should have the font family "Material Icons Round"', async () => {
      expect(await getFontFamily(1)).toBe('"Material Icons Round"');
    });
    it('Outlined Google Icon should have the correct class "Material Icons Outlined"', () =>
      expect(
        testElement[2].nativeElement.classList.contains(
          'material-icons-outlined'
        )
      ).toBeTrue());
    it('Outlined Google Icon should have the font family "Material Icons Outlined"', async () => {
      expect(await getFontFamily(2)).toBe('"Material Icons Outlined"');
    });
    it('Sharp Google Icon should have the correct class "Material Icons Sharp"', () => {
      expect(
        testElement[3].nativeElement.classList.contains('material-icons-sharp')
      ).toBeTrue();
    });
    it('Sharp Google Icon should have the font family "Material Icons Sharp"', async () => {
      expect(await getFontFamily(3)).toBe('"Material Icons Sharp"');
    });
    it('Two-tone Google Icon should have the correct class "Material Icons Two Tone"', () => {
      expect(
        testElement[4].nativeElement.classList.contains(
          'material-icons-two-tone'
        )
      ).toBeTrue();
    });
    it('Two-tone Google Icon should have the font family "Material Icons Two Tone"', async () => {
      expect(await getFontFamily(4)).toBe('"Material Icons Two Tone"');
    });

    it('should have a text nodes when the icon type is google', () => {
      const nodes = Array.from<Node>(testElement[0].nativeElement.childNodes);
      const hasTextNodes = nodes.some(
        (node) =>
          node.nodeType === Node.TEXT_NODE && node.textContent?.trim() !== ''
      );
      expect(hasTextNodes).toBeTrue();
      expect(nodes[0].textContent?.trim()).toBe('home');
    });
  });
  describe('Bootstrap Icon', () => {
    let fixture: ComponentFixture<BootstraIconTests>;
    let testElement: DebugElement;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [BootstraIconTests],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      fixture = TestBed.createComponent(BootstraIconTests);
      testElement = fixture.debugElement.query(By.directive(IconDirective));

      fixture.detectChanges();
    });

    it('should have the correct class "bi bi-0-circle-fill"', () => {
      expect(testElement.nativeElement.classList.contains('bi')).toBeTrue();
      expect(
        testElement.nativeElement.classList.contains('bi-0-circle-fill')
      ).toBeTrue();
    });

    it('should not have text nodes when the icon type is bootstrap', () => {
      const nodes = Array.from<Node>(testElement.nativeElement.childNodes);
      const hasTextNodes = nodes.some(
        (node) =>
          node.nodeType === Node.TEXT_NODE && node.textContent?.trim() !== ''
      );
      expect(hasTextNodes).toBeFalse();
    });
  });
});
