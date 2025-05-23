import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';
import { DashComponent } from './admin/pages/dash/dash.component';
import { OrdersComponent } from './admin/pages/orders/orders.component';
import { ProductsComponent } from './admin/pages/products/products.component';
import { UsersComponent } from './admin/pages/users/users.component';
import { authGuard } from './authentication/auth.guard';
import { LoginComponent } from './authentication/login/login.component';
import { RegisterComponent } from './authentication/register/register.component';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { SuccessPaymentMsgComponent } from './success-payment-msg/success-payment-msg.component';
import { PaymentComponent } from './user/component/payment/payment.component';
import { CheckOutComponent } from './user/pages/check-out/check-out.component';
import { GiftsComponent } from './user/pages/gifts/gifts.component';
import { HomeComponent } from './user/pages/home/home.component';
import { TermsAndServicesComponent } from './user/pages/terms-and-services/terms-and-services.component';
import { UserLayoutComponent } from './user/user-layout/user-layout.component';
import { CategoryComponent } from './admin/pages/category/category.component';

const routes: Routes = [
  {
    path: "", component: UserLayoutComponent, children: [
      { path: "", redirectTo: 'home', pathMatch: 'full' },
      { path: "home", component: HomeComponent },
      { path: "gifts", component: GiftsComponent },
      { path: "terms", component: TermsAndServicesComponent },
      {path:"check-out", component:CheckOutComponent,canActivate:[authGuard]},
      {path:"payment",component:PaymentComponent,canActivate:[authGuard]}
    ]
  },
  {
    path: "admin", component: AdminLayoutComponent,canActivate: [authGuard], children: [
      { path: "dash", component: DashComponent ,canActivate: [authGuard]},
      { path: "product", component: ProductsComponent,canActivate: [authGuard] },
      { path: "users", component: UsersComponent,canActivate: [authGuard] },
      {path:"order",component:OrdersComponent,canActivate: [authGuard]},
      {path:"category",component:CategoryComponent,canActivate: [authGuard]},
      {path:"admin",redirectTo:"dash",pathMatch:"full"}

    ]
  },
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  {path:"success",component:SuccessPaymentMsgComponent,canActivate:[authGuard]},
  { path: "**", component: NotFoundPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
