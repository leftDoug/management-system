import { TestBed } from '@angular/core/testing';

import { WorkersAreasService } from './workers-areas.service';

describe('WorkersAreasService', () => {
  let service: WorkersAreasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkersAreasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
