import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './views/login/login.component';
import { DashboardCategoriesComponent } from './views/dashboard-categories/dashboard-categories.component';
import { DashboardCategoryComponent } from './views/dashboard-category/dashboard-category.component';


const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'categories', component: DashboardCategoriesComponent },
  { path: 'categories/:id', component: DashboardCategoryComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
