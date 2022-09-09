import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseFriendComponent } from './choose-friend.component';

describe('ChooseFriendComponent', () => {
  let component: ChooseFriendComponent;
  let fixture: ComponentFixture<ChooseFriendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChooseFriendComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseFriendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
