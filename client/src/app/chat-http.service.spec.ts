import { TestBed } from '@angular/core/testing';

import { ChatHttpService } from './chat-http.service';

describe('ChatHttpService', () => {
  let service: ChatHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
