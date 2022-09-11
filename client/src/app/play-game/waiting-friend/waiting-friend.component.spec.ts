import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitingFriendComponent } from './waiting-friend.component';

describe('WaitingFriendComponent', () => {
  let component: WaitingFriendComponent;
  let fixture: ComponentFixture<WaitingFriendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WaitingFriendComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WaitingFriendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
