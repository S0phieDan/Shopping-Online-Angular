import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { CartItemModel } from 'src/app/model/cartItem.model';
import { ProductModel } from '../../model/product.model';
import { ProductListServiceService } from '../../services/product-list-service.service';
import { SharedServiceService } from '../../services/shared-service.service';
import { SocketioService } from '../../services/socketio.service';
import { PageEvent } from '@angular/material/paginator';
import { MatPaginator } from '@angular/material/paginator';


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: ProductModel[] = [];
  productsPerPage: ProductModel[] = [];
  chosenCategory: string = "Milk & Eggs";
  selectedCategory: number = 0;
  @Input() isAdminLogged: boolean;
  newProduct: ProductModel;
  updatedProduct: ProductModel;
  @Output() isEditProductOpened = new EventEmitter<boolean>();
  pageEvent: PageEvent = new PageEvent();
  pageSize: number = 10;
  @ViewChild('paginator') paginator: MatPaginator;

  constructor(
    private productListServiceService: ProductListServiceService, private sharedService: SharedServiceService, private socketService: SocketioService) { }

  ngOnInit(): void {
    this.getProductListFromDB();

    this.socketService.listenForData().subscribe(res => {
      this.newProduct = res[0] as ProductModel;
      if (this.newProduct.category_id.category_name.localeCompare(this.chosenCategory) === 0) {
        this.products.push(this.newProduct);
      }
    })

    this.socketService.listenForUpdatedProduct().subscribe(res => {
      if (res) {
        this.updatedProduct = res as ProductModel;

        this.products.forEach(product => {
          if (product._id.localeCompare(this.updatedProduct._id) === 0) {
            product.name = this.updatedProduct.name;
            product.price = this.updatedProduct.price;
            product.category_id = this.updatedProduct.category_id;
            product.image = this.updatedProduct.image;
          }
        })
      }
    })
  }

  receiveCategoryChange($event: any): void {
    this.chosenCategory = $event.value;
    this.selectedCategory = $event.index;
    this.getProductListFromDB();
  }

  receiveSearchEvent($event: string): void {
    this.selectedCategory = -1;
    this.searchInDB($event);
  }

  receiveChooseProductEvent(item: any): void {
    this.addProductToCart(item);
  }

  receiveUpdateProductEvent(value: boolean): void {
    this.isEditProductOpened.emit(value);
  }

  getProductListFromDB(): void {
    this.productListServiceService.getProductList(this.chosenCategory).subscribe((data: ProductModel[]) => {
      if (data)
      {
        console.log(data);
        
        this.products = data;
        this.productsPerPage = [];
        this.pageEvent.length = this.products.length;
        this.pageEvent.pageIndex = 0;
        this.pageEvent.pageSize = this.pageSize;
        this.pageEvent.previousPageIndex = 1;
        this.handlePage(this.pageEvent);
        this.paginator.firstPage();
      }
    });
  }

  searchInDB(value: string): void {
    this.productListServiceService.searchProduct(value).subscribe((data: ProductModel[]) => {
      if (data)
      {
        this.products = data;
        this.productsPerPage = data;
        this.pageEvent.length = this.products.length;
        this.pageEvent.pageIndex = 0;
        this.pageEvent.pageSize = this.pageSize;
        this.pageEvent.previousPageIndex = 1;
        this.handlePage(this.pageEvent);
        this.paginator.firstPage();
      }
    })
  }

  addProductToCart(item: any): void {
    this.productListServiceService.addProduct(item).subscribe((data: CartItemModel) => {
      if (data)
        this.sharedService.addCartItemToCart(data[0]);
    })

  }

  handlePage(event: PageEvent) {
    const { pageIndex, pageSize } = event;
    let startIndex = pageIndex * pageSize;
    let endIndex = startIndex + pageSize;
    this.productsPerPage = [];

    for (let i = startIndex; i < endIndex && i < this.products.length; i++) {
      this.productsPerPage.push(this.products[i]);
    }

    return event;
  }
}
