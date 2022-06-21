import { Component, OnInit } from '@angular/core';

enum State{
  Open,
  Closed
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})

export class MenuComponent implements OnInit {
  state: State;

  constructor() {
    this.state = State.Closed;
  }

  ngOnInit(): void {
  }

  isOpened(): boolean {
    return this.state === State.Open;
  }

  toggleStatus(): void{
    this.state === State.Open ? this.state = State.Closed : this.state = State.Open;
  }
}
