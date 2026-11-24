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

  beneficios = [
    { icono: '🛡️', texto: 'Calidad garantizada' },
    { icono: '🍃', texto: '100% Biodegradable' },
    { icono: '🏭', texto: 'Fabricado en Colombia' },
    { icono: '🚚', texto: 'Envíos a todo el país' },
  ];

  ngOnInit() {
    this.api.getProductos().subscribe({
      next: (datos) => this.productos.set(datos.filter((p) => p.activo)),
      error: () => this.error.set('No se pudo cargar el catálogo'),
    });
  }

  precio(valor: string | number) {
    return Number(valor).toLocaleString('es-CO');
  }
}
