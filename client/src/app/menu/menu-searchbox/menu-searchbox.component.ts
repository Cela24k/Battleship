import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu-searchbox',
  templateUrl: './menu-searchbox.component.html',
  styleUrls: ['./menu-searchbox.component.css']
})
export class MenuSearchboxComponent implements OnInit {

  @Input() type: string = '';

  constructor() { }

  ngOnInit(): void {
  }

}
