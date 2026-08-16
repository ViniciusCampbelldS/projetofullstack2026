import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscaEpi } from './busca-epi';

describe('BuscaEpi', () => {
  let component: BuscaEpi;
  let fixture: ComponentFixture<BuscaEpi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuscaEpi],
    }).compileComponents();

    fixture = TestBed.createComponent(BuscaEpi);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
