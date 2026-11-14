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
  subiendo = signal(false);

  editandoId: number | null = null;
  form: Promocion = this.formVacio();

  formVacio(): Promocion {
    return {
      producto_id: null,
      nombre: '',
      descripcion: '',
      imagen_url: '',
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

  nombreProducto(id: number | null) {
    if (id === null || id === undefined) return 'Varios productos';
    return this.productos().find((p) => p.id === id)?.nombre ?? '—';
  }

  imagenMostrada(p: Promocion) {
    if (p.imagen_url) return p.imagen_url;
    return this.productos().find((x) => x.id === p.producto_id)?.imagen_url ?? '';
  }

  cargar() {
    this.api.getPromociones().subscribe({
      next: (datos) => this.promociones.set(datos),
      error: () => this.error.set('No se pudieron cargar las promociones'),
    });
  }

  alElegirImagen(evento: Event) {
    const input = evento.target as HTMLInputElement;
    const archivo = input.files?.[0];
    if (!archivo) return;

    this.error.set('');
    this.subiendo.set(true);

    this.api.subirImagen(archivo).subscribe({
      next: (resp) => {
        this.form.imagen_url = resp.url;
        this.subiendo.set(false);
        input.value = '';
      },
      error: (e) => {
        this.subiendo.set(false);
        this.error.set('No se pudo subir la imagen: ' + (e.error?.error ?? 'revisa el archivo'));
        input.value = '';
      },
    });
  }

  quitarImagen() {
    this.form.imagen_url = '';
  }

  guardar() {
    this.error.set('');

    const datos: Promocion = {
      ...this.form,
      producto_id: this.form.producto_id ? this.form.producto_id : null,
    };

    const peticion = this.editandoId
      ? this.api.actualizarPromocion(this.editandoId, datos)
      : this.api.crearPromocion(datos);

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
      producto_id: p.producto_id ?? null,
      nombre: p.nombre,
      descripcion: p.descripcion ?? '',
      imagen_url: p.imagen_url ?? '',
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
