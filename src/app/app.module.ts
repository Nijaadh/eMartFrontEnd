import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { HTTP_INTERCEPTORS, provideHttpClient, withFetch } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterLinkActive } from '@angular/router';
import { AccordionModule } from 'primeng/accordion';
import { MessageService } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { CalendarModule } from 'primeng/calendar';
import { CarouselModule } from 'primeng/carousel';
import { ChartModule } from 'primeng/chart';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { FileUploadModule } from 'primeng/fileupload';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MegaMenuModule } from 'primeng/megamenu';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { MultiSelectModule } from 'primeng/multiselect';
import { PanelModule } from 'primeng/panel';
import { ProgressBarModule } from 'primeng/progressbar';
import { RippleModule } from 'primeng/ripple';
import { SidebarModule } from 'primeng/sidebar';
import { StepperModule } from 'primeng/stepper';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';
import { DashComponent } from './admin/pages/dash/dash.component';
import { OrdersComponent } from './admin/pages/orders/orders.component';
import { ProductsComponent } from './admin/pages/products/products.component';
import { UsersComponent } from './admin/pages/users/users.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptorService } from './authentication/auth-interceptor.service';
import { LoginComponent } from './authentication/login/login.component';
import { RegisterComponent } from './authentication/register/register.component';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { SuccessPaymentMsgComponent } from './success-payment-msg/success-payment-msg.component';
import { CarouselComponent } from './user/component/carousel/carousel.component';
import { FooterComponent } from './user/component/footer/footer.component';
import { HeaderComponent } from './user/component/header/header.component';
import { NavBarComponent } from './user/component/nav-bar/nav-bar.component';
import { PaymentComponent } from './user/component/payment/payment.component';
import { CheckOutComponent } from './user/pages/check-out/check-out.component';
import { HomeComponent } from './user/pages/home/home.component';
import { TermsAndServicesComponent } from './user/pages/terms-and-services/terms-and-services.component';
import { UserLayoutComponent } from './user/user-layout/user-layout.component';
import { CategoryComponent } from './admin/pages/category/category.component';
import { ItemsComponent } from './user/pages/items/items.component';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { TreeModule } from 'primeng/tree';
import { TreeSelectModule } from 'primeng/treeselect';
import { AboutUsComponent } from './user/pages/about-us/about-us.component';
import { ItemProfileComponent } from './user/pages/item-profile/item-profile.component';
import { ShoppingCartService } from './user/services/shopping.cart/shopping-cart.service';
import { CardModule } from 'primeng/card';
import { TimelineModule } from 'primeng/timeline';
 
@NgModule({
  declarations: [
    
    AppComponent,
    AdminLayoutComponent,
    UserLayoutComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    CarouselComponent,
    NavBarComponent,
    LoginComponent,
    RegisterComponent,
    NotFoundPageComponent,
    TermsAndServicesComponent,
    DashComponent,
    ProductsComponent,
    UsersComponent,
    CheckOutComponent,
    PaymentComponent,
    SuccessPaymentMsgComponent,
    OrdersComponent,
    CategoryComponent,
    ItemsComponent,
    AboutUsComponent,
    ItemProfileComponent,
    
  ],
  imports: [
    StepperModule,
    RippleModule,
    ProgressBarModule,
    InputTextareaModule,
    FloatLabelModule,
    InputTextModule,
    InputIconModule,
    IconFieldModule,
    BrowserModule,
    AppRoutingModule,
    CalendarModule,
    FormsModule,
    ReactiveFormsModule,
    FileUploadModule,
    ToastModule,
    BrowserAnimationsModule,
    MenubarModule,
    AvatarModule,
    CarouselModule,
    RouterLinkActive,
    TagModule,
    DividerModule,
    MenuModule,
    MultiSelectModule,
    DropdownModule,
    SidebarModule,
    AccordionModule,
    BadgeModule,FieldsetModule,PanelModule,
    DialogModule,DataViewModule,TableModule,BreadcrumbModule,
    ChartModule,TabViewModule,MegaMenuModule, 
    ButtonModule,
    CheckboxModule,
    TreeModule,
    TreeSelectModule,
    CardModule,
    TimelineModule
    
  ],
  providers: [
    ShoppingCartService,
    provideClientHydration(),
    MessageService,
    provideHttpClient(withFetch()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },
     
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
