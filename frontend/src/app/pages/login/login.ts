import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private auth = inject(AuthService);
  private router = inject(Router);

  username = '';
  password = '';
  error = signal('');
  cargando = signal(false);
  verClave = signal(false);

  entrar() {
    if (!this.username || !this.password) {
      this.error.set('Escribe tu usuario y tu contraseña');
      return;
    }

    this.error.set('');
    this.cargando.set(true);

    this.auth.login(this.username, this.password).subscribe({
      next: () => this.router.navigate(['/admin']),
      error: (e) => {
        this.cargando.set(false);
        this.error.set(
          e.status === 0
            ? 'No se pudo conectar con el servidor'
            : 'Usuario o contraseña incorrectos'
        );
      },
    });
  }
}