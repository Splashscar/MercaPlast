import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Producto {
  id?: number;
  nombre: string;
  categoria_id: number;
  presentacion: string;
  precio: string | number;
  descripcion?: string;
  beneficios?: string;
  usos?: string;
  imagen_url?: string;
  ficha_tecnica_url?: string;
  aromas?: string;
  activo: boolean;
}

export interface Categoria {
  id?: number;
  nombre: string;
  descripcion?: string;
  activa: boolean;
}

export interface Promocion {
  id?: number;
    producto_id: number | null;
  imagen_url?: string;
  nombre: string;
  descripcion?: string;
  precio_promocional: string | number;
  cantidad_minima: number;
  fecha_inicio: string;
  fecha_fin: string;
  activa: boolean;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = 'http://127.0.0.1:8000/api';

    subirImagen(archivo: File): Observable<{ url: string }> {
    const datos = new FormData();
    datos.append('imagen', archivo);
    return this.http.post<{ url: string }>(`${this.baseUrl}/upload-image/`, datos);
  }

  // Productos
  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.baseUrl}/products/`);
  }
  crearProducto(p: Producto): Observable<Producto> {
    return this.http.post<Producto>(`${this.baseUrl}/products/`, p);
  }
  actualizarProducto(id: number, p: Producto) {
    return this.http.put(`${this.baseUrl}/products/${id}/`, p);
  }
  eliminarProducto(id: number) {
    return this.http.delete(`${this.baseUrl}/products/${id}/`);
  }

  // Categorías
  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.baseUrl}/categories/`);
  }
  crearCategoria(c: Categoria): Observable<Categoria> {
    return this.http.post<Categoria>(`${this.baseUrl}/categories/`, c);
  }
  actualizarCategoria(id: number, c: Categoria) {
    return this.http.put(`${this.baseUrl}/categories/${id}/`, c);
  }
  eliminarCategoria(id: number) {
    return this.http.delete(`${this.baseUrl}/categories/${id}/`);
  }

  // Promociones
  getPromociones(): Observable<Promocion[]> {
    return this.http.get<Promocion[]>(`${this.baseUrl}/promotions/`);
  }
  crearPromocion(p: Promocion): Observable<Promocion> {
    return this.http.post<Promocion>(`${this.baseUrl}/promotions/`, p);
  }
  actualizarPromocion(id: number, p: Promocion) {
    return this.http.put(`${this.baseUrl}/promotions/${id}/`, p);
  }
  eliminarPromocion(id: number) {
    return this.http.delete(`${this.baseUrl}/promotions/${id}/`);
  }
}
