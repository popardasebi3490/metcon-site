import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeapComponent } from './seap.component';

describe('SeapComponent', () => {
  let component: SeapComponent;
  let fixture: ComponentFixture<SeapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeapComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SeapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
