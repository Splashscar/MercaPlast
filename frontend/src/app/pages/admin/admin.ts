import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AdminCategorias } from '../admin-categorias/admin-categorias';
import { AdminProductos } from '../admin-productos/admin-productos';

@Component({
  selector: 'app-admin',
  imports: [AdminCategorias, AdminProductos],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin {
  auth = inject(AuthService);
}
