import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { SharedServiceService } from '../../services/shared-service.service';
import { CategoryListServiceService } from '../../services/category-list-service.service';
import { CategoryModel } from '../../model/category.model';
import { NewProductFormServiceService } from '../../services/new-product-form-service.service';
import { SocketioService } from '../../services/socketio.service';
import { ProductModel } from 'src/app/model/product.model';
import { ValidationServiceService } from '../../services/validation-service.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-update-product-form',
  templateUrl: './update-product-form.component.html',
  styleUrls: ['./update-product-form.component.css']
})
export class UpdateProductFormComponent implements OnInit {
  private subscription: Subscription = new Subscription();
  productName: String = "";
  isProductNameValid: boolean = true;
  price: number;
  isPriceValid: boolean = true;
  category: String = "";
  isCategoryValid: boolean = true;
  categoryId: String = "";
  imagePath: String = "";
  isImagePathValid: boolean = true;
  _id: string = "";
  categories: CategoryModel[] = [];
  isOpenList: boolean = false;
  @ViewChild('imageElem') private imageElem: ElementRef;
  @Output() cancelEvent = new EventEmitter<boolean>();
  @Input() isHiddenBody: boolean;
  errorMessage: String = 'Input fields are invalid or empty!';
  successMessage: String = "Congratulations, the product was updated successfully!";
  isSuccess: boolean;
  isOpenPopup: boolean = false;

  constructor(private sharedService: SharedServiceService,
    private categoryListService: CategoryListServiceService,
    private newProductFormService: NewProductFormServiceService,
    private socketioService: SocketioService,
    private validationService: ValidationServiceService
  ) { }

  ngOnInit(): void {
    this.subscription.add(
      this.categoryListService.getCategories().subscribe((data: CategoryModel[]) => {
        if (data)
          this.categories = data;
      })
    )
    
    this.subscription.add(
      this.sharedService.currentProductToUpdate.subscribe(product => {
        const { name, price, image, category_id } = product;
        const { _id, category_name } = category_id;
        this.productName = name;
        this.price = price;
        this.category = category_name;
        this.categoryId = _id;
        this.imagePath = image;
        this._id = product._id;
      })
    )
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  openCategoryList(): void {
    this.isOpenList = true;
  }

  handleImage(): void {
    const files = this.imageElem.nativeElement.files;

    if (files.length) {
      const fd = new FormData();
      fd.append('image', files[0]);

      this.subscription.add(
        this.newProductFormService.insertImage(fd).subscribe(data => {
          if (data) {
            this.setImagePath(data);
          }
        })
      )
    }
  }

  setImagePath(value: string): void {
    if (value) {
      this.imagePath = value;
      this.isImagePathValid = true;
    }
    else {
      this.isImagePathValid = false;
      this.isOpenPopup = false;
    }
  }

  chooseCategory(value: string): void {
    const selected_category = value;

    const category = this.categories.filter((category) => category.category_name.localeCompare(selected_category) === 0);

    if (category) {
      this.category = category[0].category_name;
      this.categoryId = category[0]._id;
      this.isOpenList = false;
      this.errorMessage = "";
      this.isCategoryValid = true;
    }
    else {
      this.isCategoryValid = false;
    }
    this.isOpenPopup = false;
  }

  setProductName(value: string): void {
    this.productName = value;
    this.isProductNameValid = this.validationService.checkString(value);
    this.isOpenPopup = false;
  }

  setPrice(value: number): void {
    this.price = value;
    this.isPriceValid = this.validationService.checkPrice(value);
    this.isOpenPopup = false;
  }

  update(): void {
    if (this.productName && this.price && this._id && this.category && this.categoryId && this.imagePath && this.isProductNameValid && this.isPriceValid && this.isImagePathValid && this.isCategoryValid) {
      const product: ProductModel = {
        _id: this._id,
        name: this.productName,
        category_id:
        {
          _id: this.categoryId,
          category_name: this.category
        },
        price: this.price,
        image: this.imagePath
      }
      this.socketioService.emitUpdateProduct(product);
      this.isSuccess = true;
      this.isOpenPopup = true;
    }
    else {
      this.isProductNameValid = false;
      this.isPriceValid = false;
      this.isCategoryValid = false;
      this.isImagePathValid = false;
      this.isOpenPopup = true;
      this.isSuccess = false;
    }
  }

  cancelUpdate(): void {
    this.cancelEvent.emit(false);
  }

  receivePopupEvent(value: boolean): void {
    this.isOpenPopup = value;
    this.isProductNameValid = true;
    this.isPriceValid = true;
    this.isCategoryValid = true;
    this.isImagePathValid = true;
    this.isOpenPopup = false;
    this.isSuccess = false;
  }

}


