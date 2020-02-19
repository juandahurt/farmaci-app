import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardCategoriesComponent } from './views/dashboard-categories/dashboard-categories.component';
import { DashboardCategoryComponent } from './views/dashboard-category/dashboard-category.component';
import { DashboardProductsComponent } from './views/dashboard-products/dashboard-products.component';
import { DashboardProductComponent } from './views/dashboard-product/dashboard-product.component';
import { DashboardSellingCartComponent } from './views/dashboard-selling-cart/dashboard-selling-cart.component';
import { DashboardComponent } from './views/dashboard-home/dashboard-home.component';
import { DashboardExpensesComponent } from './views/dashboard-expenses/dashboard-expenses.component';
import { DashboardProvidersComponent } from './views/dashboard-providers/dashboard-providers.component';
import { DashboardNotificationsComponent } from './views/dashboard-notifications/dashboard-notifications.component';


const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'home', component: DashboardComponent },
  { path: 'categories', component: DashboardCategoriesComponent },
  { path: 'categories/:id', component: DashboardCategoryComponent },
  { path: 'products', component: DashboardProductsComponent },
  { path: 'products/:id', component: DashboardProductComponent },
  { path: 'selling-cart', component: DashboardSellingCartComponent },
  { path: 'expenses', component: DashboardExpensesComponent },
  { path: 'providers', component: DashboardProvidersComponent },
  { path: 'notifications', component: DashboardNotificationsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
