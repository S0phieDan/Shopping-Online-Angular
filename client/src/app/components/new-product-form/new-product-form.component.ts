import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { CategoryListServiceService } from '../../services/category-list-service.service';
import { CategoryModel } from '../../model/category.model';
import { NewProductFormServiceService } from '../../services/new-product-form-service.service';
import { ProductModel } from '../../model/product.model';
import { SocketioService } from '../../services/socketio.service';
import { ValidationServiceService } from '../../services/validation-service.service';

@Component({
  selector: 'app-new-product-form',
  templateUrl: './new-product-form.component.html',
  styleUrls: ['./new-product-form.component.css']
})
export class NewProductFormComponent implements OnInit {
  productName:String="";
  isProductNameValid:boolean=true;
  price:number;
  isPriceValid:boolean = true;
  category:String="";
  isCategoryValid:boolean = true;
  categoryId:String="";
  imagePath:String="";
  isImagePathValid:boolean=true;
  categories:CategoryModel[] = [];
  isOpenList:boolean = false;
  @ViewChild('imageElem') private imageElem: ElementRef;
  errorMessage:String = 'Input fields are invalid or empty!';
  successMessage:String = "Congratulations, new product was added to the store!";
  isSuccess:boolean;
  isOpenPopup:boolean = false;
  @Input() isHiddenBody:boolean;

  constructor(private categoryListService:CategoryListServiceService, 
              private newProductFormService:NewProductFormServiceService,
              private socketioService:SocketioService,
              private validationService:ValidationServiceService) { }

  ngOnInit(): void {
    this.categoryListService.getCategories().subscribe((data: CategoryModel[]) => {
      if(data)
        this.categories = data;
    });
  }

  setProductName(value:string) :void {
    this.productName = value;
    this.isProductNameValid = this.validationService.checkString(value);
    this.isOpenPopup = false;
  }

  setPrice(value:number) :void {
    this.price = value;
    this.isPriceValid = this.validationService.checkPrice(value);
    this.isOpenPopup = false;
  }

  setImagePath(value:string): void {
    if(value){
      this.imagePath = value;
      this.isImagePathValid = true;
    }
    else{
      this.isImagePathValid = false;
      this.isOpenPopup = false;
    }
  }

  openCategoryList():void
  {
    this.isOpenList = true;
    this.category="";
    this.categoryId="";
  }

  chooseCategory(value: string): void{
    const selected_category = value;

    const category = this.categories.filter((category) => category.category_name.localeCompare(selected_category) === 0);

    if(category)
    {
      this.category = category[0].category_name;
      this.categoryId = category[0]._id;
      this.isOpenList = false;
      this.errorMessage = "";
      this.isCategoryValid=true;
    }
    else
    {
      this.isCategoryValid=false;
    }
    this.isOpenPopup = false;
  }

  handleImage():void {
    const files = this.imageElem.nativeElement.files;

    if(files.length)
    {
      const fd = new FormData();
      fd.append('image', files[0]);

      this.newProductFormService.insertImage(fd).subscribe(data => {
        if(data)
        {
          this.setImagePath(data);
        }
      });

    }
  }

  addProduct():void {
    if(this.productName && this.price && this.categoryId && this.imagePath && this.isProductNameValid && this.isPriceValid && this.isCategoryValid && this.isImagePathValid)
    {
      
      const productToAdd:ProductModel = {
        _id: "newProduct",
        name: this.productName,
        category_id: 
        {
            _id: this.categoryId,
            category_name: this.category
        },
        price: this.price,
        image: this.imagePath
      }

      this.socketioService.emitData(productToAdd);
      this.productName = "";
      this.price = 0
      this.categoryId = "";
      this.category = "";
      this.imagePath = "";
      this.isSuccess = true;
      this.isOpenPopup = true;
    }
    else
    {
      this.isProductNameValid = false;
      this.isPriceValid = false;
      this.isCategoryValid = false;
      this.isImagePathValid = false;
      this.isOpenPopup = true;
      this.isSuccess = false;
    }
  }

  receivePopupEvent(value: boolean): void{
    this.isOpenPopup = value;
  }
}


