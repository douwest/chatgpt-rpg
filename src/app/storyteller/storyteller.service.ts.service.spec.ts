import { TestBed } from '@angular/core/testing';

import { StorytellerServiceTsService } from './storyteller.service.ts.service';

describe('StorytellerServiceTsService', () => {
  let service: StorytellerServiceTsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorytellerServiceTsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
