import { Component, OnInit, inject, signal } from '@angular/core';
import { ApiService, Producto } from '../../services/api.service';

@Component({
  selector: 'app-catalogo',
  imports: [],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.css',
})
export class Catalogo implements OnInit {
  private api = inject(ApiService);

  productos = signal<Producto[]>([]);
  error = signal('');

  ngOnInit() {
    this.api.getProductos().subscribe({
      next: (datos) => this.productos.set(datos),
      error: () => this.error.set('No se pudo conectar con el backend'),
    });
  }
}