import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkersTableComponent } from './workers-table.component';

describe('WorkersTableComponent', () => {
  let component: WorkersTableComponent;
  let fixture: ComponentFixture<WorkersTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WorkersTableComponent]
    });
    fixture = TestBed.createComponent(WorkersTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
