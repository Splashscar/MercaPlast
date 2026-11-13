import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AdminCategorias } from '../admin-categorias/admin-categorias';
import { AdminProductos } from '../admin-productos/admin-productos';
import { AdminPromociones } from '../admin-promociones/admin-promociones';

@Component({
  selector: 'app-admin',
  imports: [AdminCategorias, AdminProductos, AdminPromociones],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin {
  auth = inject(AuthService);
}
