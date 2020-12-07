import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ProductModel } from '../../model/product.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  @Output() searchEvent = new EventEmitter<string>();
  @Output() searchInOrderEvent = new EventEmitter<string>();
  searchInput: string = "";
  productsFromSearch: ProductModel[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  setSearchInput(value: string): void {
    this.searchInput = value;
    this.searchInOrderEvent.emit(this.searchInput);
  }

  search(): void {
    if (this.searchInput) {
      this.searchEvent.emit(this.searchInput);
      this.searchInput = "";
    }
  }
}
