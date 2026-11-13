import { Routes } from '@angular/router';
import { Catalogo } from './pages/catalogo/catalogo';
import { Login } from './pages/login/login';
import { Admin } from './pages/admin/admin';
import { authGuard } from './services/auth.guard';

export const routes: Routes = [
  { path: '', component: Catalogo },
  { path: 'login', component: Login },
  { path: 'admin', component: Admin, canActivate: [authGuard] },
];
