import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { StoreComponent } from './components/store/store.component';
import { AuthGuard } from './guards/authGuard';
import { AdminAuthGuard } from './guards/adminAuthGuard';
import { ManagementComponent } from './components/management/management.component';
import { OrderComponent } from './components/order/order.component';
import { OrderCompleteComponent } from './components/order-complete/order-complete.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'store', component: StoreComponent, canActivate:[AuthGuard]},
  {path: 'store-management', component: ManagementComponent, canActivate:[AdminAuthGuard]},
  {path: 'store/order-details', component: OrderComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
