import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './views/login/login.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { DashboardCategoriesComponent } from './views/dashboard-categories/dashboard-categories.component';
import { CategoryService } from 'src/services/category.service';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DashboardCategoryComponent } from './views/dashboard-category/dashboard-category.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardProductsComponent } from './views/dashboard-products/dashboard-products.component';
import { NgbdSortableHeader } from './views/dashboard-products/dashboard-products.component';
import { ProductService } from 'src/services/product.service';
import { AddProductFormComponent } from './components/add-product-form/add-product-form.component';
import { DashboardProductComponent } from './views/dashboard-product/dashboard-product.component';
import { DashboardSellingCartComponent } from './views/dashboard-selling-cart/dashboard-selling-cart.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SidebarComponent,
    DashboardCategoriesComponent,
    DashboardCategoryComponent,
    DashboardProductsComponent,
    NgbdSortableHeader,
    AddProductFormComponent,
    DashboardProductComponent,
    DashboardSellingCartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    CategoryService,
    ProductService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
