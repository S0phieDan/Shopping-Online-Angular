import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent implements OnInit {
  @Input() isSuccess: boolean;
  @Output() popupEvent: EventEmitter<boolean> = new EventEmitter();
  @Input() successMessage: String;
  @Input() errorMessage: String;

  constructor() { }

  ngOnInit(): void {
  }

  closePopup() {
    this.popupEvent.emit(false);
  }

}
