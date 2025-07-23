import {
  Component,
  DebugElement,
  provideZonelessChangeDetection,
} from '@angular/core';
import { ButtonDirective } from './button.directive';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

@Component({
  selector: 'app-button-test',
  template: `<button ksButton>Test Button</button>`,
  standalone: true,
  imports: [ButtonDirective],
})
export class ButtonTestComponent {}

describe('ButtonDirective', () => {
  let fixture: ComponentFixture<ButtonTestComponent>;
  let testElement: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ButtonTestComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonTestComponent);
    testElement = fixture.debugElement.query(By.directive(ButtonDirective));
    fixture.detectChanges();
  });
  it('should create an instance via TestBed', () => {
    const directiveInstance = testElement.injector.get(ButtonDirective);
    expect(directiveInstance).toBeTruthy();
  });
  it('Should have default size as "md"', () => {
    expect(fixture.nativeElement).toHaveClass('btn-md');
  });
});
