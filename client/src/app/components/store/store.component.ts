import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css']
})
export class StoreComponent implements OnInit {
  minimizedSize: boolean;

  constructor() { }

  ngOnInit(): void {
  }

  receiveChangeCartSizeEvent(value: boolean): void {
    this.minimizedSize = value;
  }

}
