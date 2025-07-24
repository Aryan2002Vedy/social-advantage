import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin/dashboard/dashboard.component';
import { LoginComponent } from './admin/login.component';
import { HomeComponent } from './home/home.component'; // ⬅️ import HomeComponent
import { authGuard } from './services/auth.guard'; // ⬅️ import

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [authGuard], // ⬅️ protect this
  },
];
