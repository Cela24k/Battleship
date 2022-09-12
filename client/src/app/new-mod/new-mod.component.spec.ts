import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewModComponent } from './new-mod.component';

describe('NewModComponent', () => {
  let component: NewModComponent;
  let fixture: ComponentFixture<NewModComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewModComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewModComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
