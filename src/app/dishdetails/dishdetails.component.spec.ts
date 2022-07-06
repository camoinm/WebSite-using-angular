import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DishdetailsComponent } from './dishdetails.component';

describe('DishdetailsComponent', () => {
  let component: DishdetailsComponent;
  let fixture: ComponentFixture<DishdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DishdetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DishdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
