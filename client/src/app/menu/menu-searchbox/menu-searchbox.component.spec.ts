import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuSearchboxComponent } from './menu-searchbox.component';

describe('MenuSearchboxComponent', () => {
  let component: MenuSearchboxComponent;
  let fixture: ComponentFixture<MenuSearchboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuSearchboxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuSearchboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
