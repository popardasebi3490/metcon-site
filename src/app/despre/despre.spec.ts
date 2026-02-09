import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Despre } from './despre';

describe('Despre', () => {
  let component: Despre;
  let fixture: ComponentFixture<Despre>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Despre]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Despre);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
