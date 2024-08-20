import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreasTableComponent } from './areas-table.component';

describe('AreasTableComponent', () => {
  let component: AreasTableComponent;
  let fixture: ComponentFixture<AreasTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AreasTableComponent]
    });
    fixture = TestBed.createComponent(AreasTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
