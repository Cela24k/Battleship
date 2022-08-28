import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayGameRandomComponent } from './play-game-random.component';

describe('PlayGameRandomComponent', () => {
  let component: PlayGameRandomComponent;
  let fixture: ComponentFixture<PlayGameRandomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayGameRandomComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayGameRandomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
