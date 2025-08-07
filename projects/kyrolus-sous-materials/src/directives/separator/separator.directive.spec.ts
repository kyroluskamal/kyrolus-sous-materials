import {
  Component,
  DebugElement,
  provideZonelessChangeDetection,
} from '@angular/core';
import { SeparatorDirective } from './separator.directive';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

@Component({
  selector: 'app-tests',
  imports: [SeparatorDirective],
  template: `
    <div ksSeparator></div>
    <div ksSeparator isDecorative></div>
  `,
  styles: ``,
})
export class TestsComponent {}

describe('SeparatorDirective', () => {
  let fixture: ComponentFixture<TestsComponent>;
  let testElement: DebugElement[];
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestsComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(TestsComponent);
    testElement = fixture.debugElement.queryAll(
      By.directive(SeparatorDirective)
    );

    fixture.detectChanges();
  });

  it('should create an instance', () => {
    const directiveInstance = testElement[0].injector.get(SeparatorDirective);
    expect(directiveInstance).toBeTruthy();
  });

  it('should have the role attribute set to "separator" when not decorative', () => {
    const directiveInstance = testElement[0].injector.get(SeparatorDirective);
    expect(directiveInstance.isDecorative()).toBeFalsy();
    expect(testElement[0].nativeElement.getAttribute('role')).toBe('separator');
  });

  it('should have the role attribute set to null when decorative', () => {
    const directiveInstance = testElement[1].injector.get(SeparatorDirective);
    expect(directiveInstance.isDecorative()).toBeTruthy();
    expect(testElement[1].nativeElement.getAttribute('role')).toBeNull();
  });

  it('should have aria-hidden set to true when decorative', () => {
    const directiveInstance = testElement[1].injector.get(SeparatorDirective);
    expect(directiveInstance.isDecorative()).toBeTruthy();
    expect(testElement[1].nativeElement.getAttribute('aria-hidden')).toBe(
      'true'
    );
  });
});
