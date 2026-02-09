import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cariere } from './cariere';

describe('Cariere', () => {
  let component: Cariere;
  let fixture: ComponentFixture<Cariere>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cariere]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Cariere);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
