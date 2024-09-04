import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaInfoComponent } from './agenda-info.component';

describe('AgendaInfoComponent', () => {
  let component: AgendaInfoComponent;
  let fixture: ComponentFixture<AgendaInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgendaInfoComponent]
    });
    fixture = TestBed.createComponent(AgendaInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
