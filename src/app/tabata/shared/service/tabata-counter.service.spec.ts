import { TestBed } from '@angular/core/testing';

import { TabataCounterService } from './tabata-counter.service';

describe('TabataCounterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TabataCounterService = TestBed.get(TabataCounterService);
    expect(service).toBeTruthy();
  });
});
