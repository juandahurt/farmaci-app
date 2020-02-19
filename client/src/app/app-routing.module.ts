import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { DashboardCategoryComponent } from './views/dashboard-category/dashboard-category.component';
import { DashboardProductComponent } from './views/dashboard-product/dashboard-product.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'categories/:id', component: DashboardCategoryComponent },
  { path: 'products/:id', component: DashboardProductComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
