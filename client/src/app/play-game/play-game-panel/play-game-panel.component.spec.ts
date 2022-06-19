import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayGamePanelComponent } from './play-game-panel.component';

describe('PlayGamePanelComponent', () => {
  let component: PlayGamePanelComponent;
  let fixture: ComponentFixture<PlayGamePanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayGamePanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayGamePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
