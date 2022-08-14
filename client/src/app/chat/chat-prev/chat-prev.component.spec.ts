import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatPrevComponent } from './chat-prev.component';

describe('ChatPrevComponent', () => {
  let component: ChatPrevComponent;
  let fixture: ComponentFixture<ChatPrevComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatPrevComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatPrevComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
