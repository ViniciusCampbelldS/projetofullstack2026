import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AlteraTreinamento } from './altera-treinamento';

describe('AlteraTreinamento', () => {
  let component: AlteraTreinamento;
  let fixture: ComponentFixture<AlteraTreinamento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlteraTreinamento],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AlteraTreinamento);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
