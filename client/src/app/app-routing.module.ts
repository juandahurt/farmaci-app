import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './views/login/login.component';
import { DashboardCategoriesComponent } from './views/dashboard-categories/dashboard-categories.component';


const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'categories', component: DashboardCategoriesComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
