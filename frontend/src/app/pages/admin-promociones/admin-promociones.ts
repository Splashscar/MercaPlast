import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService, Producto, Promocion } from '../../services/api.service';

@Component({
  selector: 'app-admin-promociones',
  imports: [FormsModule],
  templateUrl: './admin-promociones.html',
  styleUrl: './admin-promociones.css',
})
export class AdminPromociones implements OnInit {
  private api = inject(ApiService);

  promociones = signal<Promocion[]>([]);
  productos = signal<Producto[]>([]);
  error = signal('');

  editandoId: number | null = null;
  form: Promocion = this.formVacio();

  formVacio(): Promocion {
    return {
      producto_id: 0,
      nombre: '',
      descripcion: '',
      precio_promocional: '',
      cantidad_minima: 1,
      fecha_inicio: '',
      fecha_fin: '',
      activa: true,
    };
  }

  ngOnInit() {
    this.cargar();
    this.api.getProductos().subscribe({
      next: (datos) => this.productos.set(datos),
    });
  }

  nombreProducto(id: number) {
    return this.productos().find((p) => p.id === id)?.nombre ?? '—';
  }

  cargar() {
    this.api.getPromociones().subscribe({
      next: (datos) => this.promociones.set(datos),
      error: () => this.error.set('No se pudieron cargar las promociones'),
    });
  }

  guardar() {
    this.error.set('');

    const peticion = this.editandoId
      ? this.api.actualizarPromocion(this.editandoId, this.form)
      : this.api.crearPromocion(this.form);

    peticion.subscribe({
      next: () => {
        this.cancelar();
        this.cargar();
      },
      error: (e) =>
        this.error.set('No se pudo guardar: ' + JSON.stringify(e.error ?? 'revisa los datos')),
    });
  }

  editar(p: Promocion) {
    this.editandoId = p.id ?? null;
    this.form = {
      producto_id: p.producto_id,
      nombre: p.nombre,
      descripcion: p.descripcion ?? '',
      precio_promocional: p.precio_promocional,
      cantidad_minima: p.cantidad_minima,
      fecha_inicio: p.fecha_inicio,
      fecha_fin: p.fecha_fin,
      activa: p.activa,
    };
  }

  eliminar(p: Promocion) {
    if (!p.id || !confirm(`¿Eliminar la promoción "${p.nombre}"?`)) return;

    this.api.eliminarPromocion(p.id).subscribe({
      next: () => this.cargar(),
      error: () => this.error.set('No se pudo eliminar'),
    });
  }

  cancelar() {
    this.editandoId = null;
    this.form = this.formVacio();
  }
}
