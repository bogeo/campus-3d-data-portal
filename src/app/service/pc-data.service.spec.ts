import { TestBed } from '@angular/core/testing';

import { PcDataService } from './pc-data.service';

describe('PcDataService', () => {
  let service: PcDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PcDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
