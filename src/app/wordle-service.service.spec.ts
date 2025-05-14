import { TestBed } from '@angular/core/testing';

import { WordleServiceService } from './wordle-service.service';

describe('WordleServiceService', () => {
  let service: WordleServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WordleServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
