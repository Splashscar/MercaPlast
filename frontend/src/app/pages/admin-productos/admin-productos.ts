import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService, Categoria, Producto } from '../../services/api.service';

@Component({
  selector: 'app-admin-productos',
  imports: [FormsModule],
  templateUrl: './admin-productos.html',
  styleUrl: './admin-productos.css',
})
export class AdminProductos implements OnInit {
  private api = inject(ApiService);

  productos = signal<Producto[]>([]);
  categorias = signal<Categoria[]>([]);
  error = signal('');

  editandoId: number | null = null;
  form: Producto = this.formVacio();

  formVacio(): Producto {
    return {
      nombre: '',
      categoria_id: 0,
      presentacion: '',
      precio: '',
      descripcion: '',
      beneficios: '',
      usos: '',
      imagen_url: '',
      ficha_tecnica_url: '',
      aromas: '',
      activo: true,
    };
  }

  ngOnInit() {
    this.cargar();
    this.api.getCategorias().subscribe({
      next: (datos) => this.categorias.set(datos),
    });
  }

  nombreCategoria(id: number) {
    return this.categorias().find((c) => c.id === id)?.nombre ?? '—';
  }

  cargar() {
    this.api.getProductos().subscribe({
      next: (datos) => this.productos.set(datos),
      error: () => this.error.set('No se pudieron cargar los productos'),
    });
  }

  guardar() {
    this.error.set('');

    const peticion = this.editandoId
      ? this.api.actualizarProducto(this.editandoId, this.form)
      : this.api.crearProducto(this.form);

    peticion.subscribe({
      next: () => {
        this.cancelar();
        this.cargar();
      },
      error: (e) =>
        this.error.set('No se pudo guardar: ' + JSON.stringify(e.error ?? 'revisa los datos')),
    });
  }

  editar(p: Producto) {
    this.editandoId = p.id ?? null;
    this.form = {
      nombre: p.nombre,
      categoria_id: p.categoria_id,
      presentacion: p.presentacion,
      precio: p.precio,
      descripcion: p.descripcion ?? '',
      beneficios: p.beneficios ?? '',
      usos: p.usos ?? '',
      imagen_url: p.imagen_url ?? '',
      ficha_tecnica_url: p.ficha_tecnica_url ?? '',
      aromas: p.aromas ?? '',
      activo: p.activo,
    };
  }

  eliminar(p: Producto) {
    if (!p.id || !confirm(`¿Eliminar el producto "${p.nombre}"?`)) return;

    this.api.eliminarProducto(p.id).subscribe({
      next: () => this.cargar(),
      error: () => this.error.set('No se pudo eliminar'),
    });
  }

  cancelar() {
    this.editandoId = null;
    this.form = this.formVacio();
  }
}
