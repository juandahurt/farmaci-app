import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
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
import { DimensionService } from 'src/services/dimension.service';
import { AddDimensionsFormComponent } from './components/add-dimensions-form/add-dimensions-form.component';
import { DimensionSharedService } from 'src/services/dimension.shared.service';
import { AddUnitsFormComponent } from './components/add-units-form/add-units-form.component';
import { UnitService } from 'src/services/unit.service';
import { UnitSharedService } from 'src/services/unit.shared.service';
import { BillService } from 'src/services/bill.service';
import { DashboardComponent } from './views/dashboard-home/dashboard-home.component';
import { ChartsModule } from 'ng2-charts';
import { StatsService } from 'src/services/stats.service';
import { DashboardExpensesComponent } from './views/dashboard-expenses/dashboard-expenses.component';
import { ExpenseService } from 'src/services/expense.service';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    DashboardCategoriesComponent,
    DashboardCategoryComponent,
    DashboardProductsComponent,
    NgbdSortableHeader,
    AddProductFormComponent,
    DashboardProductComponent,
    DashboardSellingCartComponent,
    AddDimensionsFormComponent,
    AddUnitsFormComponent,
    DashboardComponent,
    DashboardExpensesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    ChartsModule
  ],
  providers: [
    CategoryService,
    ProductService,
    DimensionService,
    DimensionSharedService,
    UnitService,
    UnitSharedService,
    BillService,
    StatsService,
    ExpenseService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
