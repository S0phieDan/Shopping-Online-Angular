import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { StoreAdComponent } from './components/store-ad/store-ad.component';
import { StoreDataComponent } from './components/store-data/store-data.component';
import { StoreComponent } from './components/store/store.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { FormsModule } from '@angular/forms';
import { ProductComponent } from './components/product/product.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { SearchComponent } from './components/search/search.component';
import { CartComponent } from './components/cart/cart.component';
import { CartItemComponent } from './components/cart-item/cart-item.component';
import { RegisterComponent } from './components/register/register.component';
import { StepperComponent } from './components/stepper/stepper.component';
import { PopupComponent } from './components/popup/popup.component';
import { AuthGuard } from './guards/authGuard';
import { AdminAuthGuard } from './guards/adminAuthGuard';
import { ManagementComponent } from './components/management/management.component';
import { NewProductFormComponent } from './components/new-product-form/new-product-form.component';
import { SocketioService } from './services/socketio.service';
import { UpdateProductFormComponent } from './components/update-product-form/update-product-form.component';
import { OrderComponent } from './components/order/order.component';
import { CartOrderComponent } from './components/cart-order/cart-order.component';
import { OrderDetailsComponent } from './components/order-details/order-details.component';
import { CartItemOrderComponent } from './components/cart-item-order/cart-item-order.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatInputModule} from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { OrderCompleteComponent } from './components/order-complete/order-complete.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    StoreAdComponent,
    StoreDataComponent,
    StoreComponent,
    ProductListComponent,
    ProductComponent,
    CategoriesComponent,
    SearchComponent,
    CartComponent,
    CartItemComponent,
    RegisterComponent,
    StepperComponent,
    PopupComponent,
    ManagementComponent,
    NewProductFormComponent,
    UpdateProductFormComponent,
    OrderComponent,
    CartOrderComponent,
    OrderDetailsComponent,
    CartItemOrderComponent,
    OrderCompleteComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NoopAnimationsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatFormFieldModule
  ],

  providers: [AuthGuard, AdminAuthGuard, SocketioService],
  bootstrap: [AppComponent]
})
export class AppModule { }
