import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkerInfoComponent } from './worker-info.component';

describe('WorkerInfoComponent', () => {
  let component: WorkerInfoComponent;
  let fixture: ComponentFixture<WorkerInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WorkerInfoComponent]
    });
    fixture = TestBed.createComponent(WorkerInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
