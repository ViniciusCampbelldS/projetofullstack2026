import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlteraTreinamento } from './altera-treinamento';

describe('AlteraTreinamento', () => {
  let component: AlteraTreinamento;
  let fixture: ComponentFixture<AlteraTreinamento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlteraTreinamento],
    }).compileComponents();

    fixture = TestBed.createComponent(AlteraTreinamento);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
