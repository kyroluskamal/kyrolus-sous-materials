import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopoverMenuBlock } from './popover-menu.block';
import { provideZonelessChangeDetection } from '@angular/core';

describe('PopoverMenuBlock', () => {
  let component: PopoverMenuBlock;
  let fixture: ComponentFixture<PopoverMenuBlock>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopoverMenuBlock],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(PopoverMenuBlock);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
