import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpiList } from './epi-list';

describe('EpiList', () => {
  let component: EpiList;
  let fixture: ComponentFixture<EpiList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EpiList],
    }).compileComponents();

    fixture = TestBed.createComponent(EpiList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
