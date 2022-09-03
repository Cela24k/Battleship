import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendsScreenComponent } from './friends-screen.component';

describe('FriendsScreenComponent', () => {
  let component: FriendsScreenComponent;
  let fixture: ComponentFixture<FriendsScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FriendsScreenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FriendsScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
