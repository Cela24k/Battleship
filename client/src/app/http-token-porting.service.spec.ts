import { TestBed } from '@angular/core/testing';

import { HttpTokenPortingService } from './http-token-porting.service';

describe('HttpTokenPortingService', () => {
  let service: HttpTokenPortingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpTokenPortingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
