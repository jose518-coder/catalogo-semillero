import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { RegistrarUsuario } from '../models/registrar-usuario';

interface UsuarioApi {
  id: number;
  email: string;
}

export interface UsuarioSesion {
  usuario: string;
  rol: 'admin' | 'usuario';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly CLAVE = 'usuario_wposs';

  correoEstaDisponible(correo: string): Observable<boolean> {
    const correoNormalizado = correo.trim().toLowerCase();

    return this.http.get<UsuarioApi[]>(
      `${environment.apiUrl}/users`
    ).pipe(
      map(usuarios =>
        !usuarios.some(
          usuario =>
            usuario.email.trim().toLowerCase() === correoNormalizado
        )
      )
    );
  }

  registrar(datos: RegistrarUsuario): Observable<RegistrarUsuario> {
    return this.http.post<RegistrarUsuario>(
      `${environment.apiUrl}/users`,
      datos
    );
  }

  iniciarSesion(
    usuario: string,
    clave: string
  ): boolean {
    if (clave !== 'wposs123') {
      return false;
    }

    const sesion: UsuarioSesion = {
      usuario,
      rol: usuario.toLowerCase() === 'admin'
        ? 'admin'
        : 'usuario'
    };

    try {
      localStorage.setItem(
        this.CLAVE,
        JSON.stringify(sesion)
      );

      return true;
    } catch (error) {
      console.error(
        'No se pudo guardar la sesión',
        error
      );

      return false;
    }
  }

  cerrarSesion(): void {
    try {
      localStorage.removeItem(this.CLAVE);
    } catch (error) {
      console.error(
        'No se pudo cerrar la sesión',
        error
      );
    }
  }

  estaAutenticado(): boolean {
    try {
      const sesion = localStorage.getItem(this.CLAVE);

      if (!sesion) {
        return false;
      }

      const usuario: unknown = JSON.parse(sesion);

      return (
        typeof usuario === 'object' &&
        usuario !== null &&
        'usuario' in usuario
      );
    } catch (error) {
      console.error(
        'Sesión inválida',
        error
      );

      return false;
    }
  }

  tieneRol(rol: string): boolean {
    try {
      const sesion = localStorage.getItem(this.CLAVE);

      if (!sesion) {
        return false;
      }

      const usuario = JSON.parse(sesion) as UsuarioSesion;

      return usuario.rol === rol;
    } catch (error) {
      console.error(
        'No se pudo obtener el rol',
        error
      );

      return false;
    }
  }

  obtenerUsuario(): UsuarioSesion | null {
    try {
      const sesion = localStorage.getItem(this.CLAVE);

      if (!sesion) {
        return null;
      }

      return JSON.parse(sesion) as UsuarioSesion;
    } catch (error) {
      console.error(
        'Sesión inválida',
        error
      );

      return null;
    }
  }
}