import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile-banner',
  templateUrl: './profile-banner.component.html',
  styleUrls: ['./profile-banner.component.css']
})
export class ProfileBannerComponent implements OnInit {
  @Input('text') text!: string;
  
  constructor(  ) { }

  ngOnInit(): void {
  }

}
