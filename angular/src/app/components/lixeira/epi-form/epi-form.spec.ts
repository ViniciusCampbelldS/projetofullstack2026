import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpiForm } from './epi-form';

describe('EpiForm', () => {
  let component: EpiForm;
  let fixture: ComponentFixture<EpiForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EpiForm],
    }).compileComponents();

    fixture = TestBed.createComponent(EpiForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
