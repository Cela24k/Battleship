import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaySearchboxComponent } from './play-searchbox.component';

describe('PlaySearchboxComponent', () => {
  let component: PlaySearchboxComponent;
  let fixture: ComponentFixture<PlaySearchboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlaySearchboxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaySearchboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
