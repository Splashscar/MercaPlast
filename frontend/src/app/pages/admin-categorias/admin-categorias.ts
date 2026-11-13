import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService, Categoria } from '../../services/api.service';

@Component({
  selector: 'app-admin-categorias',
  imports: [FormsModule],
  templateUrl: './admin-categorias.html',
  styleUrl: './admin-categorias.css',
})
export class AdminCategorias implements OnInit {
  private api = inject(ApiService);

  categorias = signal<Categoria[]>([]);
  error = signal('');

  editandoId: number | null = null;
  form: Categoria = { nombre: '', descripcion: '', activa: true };

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.api.getCategorias().subscribe({
      next: (datos) => this.categorias.set(datos),
      error: () => this.error.set('No se pudieron cargar las categorías'),
    });
  }

  guardar() {
    this.error.set('');

    const peticion = this.editandoId
      ? this.api.actualizarCategoria(this.editandoId, this.form)
      : this.api.crearCategoria(this.form);

    peticion.subscribe({
      next: () => {
        this.cancelar();
        this.cargar();
      },
      error: () => this.error.set('No se pudo guardar. Revisa los datos.'),
    });
  }

  editar(c: Categoria) {
    this.editandoId = c.id ?? null;
    this.form = { nombre: c.nombre, descripcion: c.descripcion ?? '', activa: c.activa };
  }

  eliminar(c: Categoria) {
    if (!c.id || !confirm(`¿Eliminar la categoría "${c.nombre}"?`)) return;

    this.api.eliminarCategoria(c.id).subscribe({
      next: () => this.cargar(),
      error: () => this.error.set('No se pudo eliminar'),
    });
  }

  cancelar() {
    this.editandoId = null;
    this.form = { nombre: '', descripcion: '', activa: true };
  }
}
