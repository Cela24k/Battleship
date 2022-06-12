import { TestBed } from '@angular/core/testing';

import { NotificationListenerService } from './notification-listener.service';

describe('NotificationListenerService', () => {
  let service: NotificationListenerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationListenerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
