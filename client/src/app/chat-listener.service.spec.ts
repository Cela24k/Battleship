import { TestBed } from '@angular/core/testing';

import { ChatListenerService } from './chat-listener.service';

describe('ChatListenerService', () => {
  let service: ChatListenerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatListenerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
