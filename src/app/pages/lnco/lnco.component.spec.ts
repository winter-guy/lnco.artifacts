import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LncoComponent } from './lnco.component';

describe('LncoComponent', () => {
  let component: LncoComponent;
  let fixture: ComponentFixture<LncoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LncoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LncoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
