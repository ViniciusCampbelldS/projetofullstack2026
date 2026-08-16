import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PresencaTreinamento } from './presenca-treinamento';

describe('PresencaTreinamento', () => {
  let component: PresencaTreinamento;
  let fixture: ComponentFixture<PresencaTreinamento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PresencaTreinamento],
    }).compileComponents();

    fixture = TestBed.createComponent(PresencaTreinamento);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
