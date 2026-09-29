import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { RegistrarUsuario } from '../models/registrar-usuario';

interface RespuestaAuth {
  token: string;
  tipo: string;
  usuario: string;
  rol: string;
}

interface ContenidoToken {
  sub: string;
  exp: number;
}

interface PerfilApi {
  id: number;
  usuario: string;
  correo: string;
  rol: string;
  activo: boolean;
}

export interface PerfilUsuario {
  id: number;
  name: string;
  email: string;
  role: string;
  activo: boolean;
}

const CLAVE_TOKEN = 'wposs_token';
const CLAVE_PERFIL = 'wposs_perfil';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);

  private token = signal<string | null>(this.leerToken());

  private perfil = signal<PerfilUsuario | null>(
    this.leerPerfil()
  );

  usuario = computed(() => {
    const token = this.token();

    if (!token) {
      return null;
    }

    return this.decodificarToken(token);
  });

  estaAutenticado = computed(() => {
    const usuario = this.usuario();

    return usuario !== null &&
      usuario.exp * 1000 > Date.now();
  });

  iniciarSesion(
    usuario: string,
    clave: string
  ): Observable<RespuestaAuth> {
    return this.http.post<RespuestaAuth>(
      `${environment.apiUrl}/auth/login`,
      {
        usuario,
        contrasena: clave
      }
    ).pipe(
      tap(respuesta => {
        this.guardarToken(respuesta.token);
      })
    );
  }

  registrar(
    datos: RegistrarUsuario
  ): Observable<RespuestaAuth> {
    return this.http.post<RespuestaAuth>(
      `${environment.apiUrl}/auth/registro`,
      datos
    );
  }

  cargarPerfil(): Observable<PerfilUsuario> {
    return this.http.get<PerfilApi>(
      `${environment.apiUrl}/auth/yo`
    ).pipe(
      map(perfil => ({
        id: perfil.id,
        name: perfil.usuario,
        email: perfil.correo,
        role: perfil.rol,
        activo: perfil.activo
      })),
      tap(perfil => this.guardarPerfil(perfil))
    );
  }

  cerrarSesion(): void {
    try {
      localStorage.removeItem(CLAVE_TOKEN);
      localStorage.removeItem(CLAVE_PERFIL);
    } catch {
      // El almacenamiento local puede no estar disponible.
    }

    this.token.set(null);
    this.perfil.set(null);
  }

  obtenerToken(): string | null {
    return this.token();
  }

  obtenerPerfil(): PerfilUsuario | null {
    return this.perfil();
  }

  tieneRol(rol: string): boolean {
    return this.perfil()?.role === rol;
  }

  private guardarToken(token: string): void {
    try {
      localStorage.setItem(CLAVE_TOKEN, token);
    } catch {
      // Se mantiene el estado en memoria.
    }

    this.token.set(token);
  }

  private guardarPerfil(perfil: PerfilUsuario): void {
    try {
      localStorage.setItem(
        CLAVE_PERFIL,
        JSON.stringify(perfil)
      );
    } catch {
      // Se mantiene el estado en memoria.
    }

    this.perfil.set(perfil);
  }

  private leerToken(): string | null {
    try {
      return localStorage.getItem(CLAVE_TOKEN);
    } catch {
      return null;
    }
  }

  private leerPerfil(): PerfilUsuario | null {
    try {
      const datos = localStorage.getItem(CLAVE_PERFIL);

      if (!datos) {
        return null;
      }

      const perfil: unknown = JSON.parse(datos);

      if (
        typeof perfil !== 'object' ||
        perfil === null ||
        !('id' in perfil) ||
        !('email' in perfil) ||
        !('role' in perfil) ||
        !('name' in perfil)
      ) {
        return null;
      }

      return perfil as PerfilUsuario;
    } catch {
      return null;
    }
  }

  private decodificarToken(
    token: string
  ): ContenidoToken | null {
    try {
      const partes = token.split('.');

      if (partes.length !== 3) {
        return null;
      }

      const payload = partes[1]
        .replace(/-/g, '+')
        .replace(/_/g, '/');

      const decodificado = atob(
        payload.padEnd(
          Math.ceil(payload.length / 4) * 4,
          '='
        )
      );

      return JSON.parse(decodificado) as ContenidoToken;
    } catch {
      return null;
    }
  }
}