import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpiDetalhe } from './epi-detalhe';

describe('EpiDetalhe', () => {
  let component: EpiDetalhe;
  let fixture: ComponentFixture<EpiDetalhe>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EpiDetalhe],
    }).compileComponents();

    fixture = TestBed.createComponent(EpiDetalhe);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
