import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdusDetaliuComponent } from './produs-detaliu';

describe('ProdusDetaliu', () => {
  let component: ProdusDetaliuComponent;
  let fixture: ComponentFixture<ProdusDetaliuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProdusDetaliuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProdusDetaliuComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
