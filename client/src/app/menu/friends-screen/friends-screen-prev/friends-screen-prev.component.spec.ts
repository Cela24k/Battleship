import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendsScreenPrevComponent } from './friends-screen-prev.component';

describe('FriendsScreenPrevComponent', () => {
  let component: FriendsScreenPrevComponent;
  let fixture: ComponentFixture<FriendsScreenPrevComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FriendsScreenPrevComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FriendsScreenPrevComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
