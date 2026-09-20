import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { RegistrarUsuario } from '../models/registrar-usuario';

interface RespuestaLogin {
  access_token: string;
}

interface ContenidoToken {
  sub: string;
  email?: string;
  correo?: string;
  exp: number;
}

interface UsuarioApi {
  id: number;
  email: string;
}

export interface PerfilUsuario {
  id: number;
  email: string;
  name: string;
  role: string;
  avatar?: string;
}

const CLAVE_TOKEN = 'wposs_token';
const CLAVE_PERFIL = 'wposs_perfil';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);

  private token = signal<string | null>(
    this.leerToken()
  );

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
    correo: string,
    clave: string
  ): Observable<RespuestaLogin> {
    return this.http
      .post<RespuestaLogin>(
        `${environment.apiUrl}/auth/login`,
        {
          email: correo,
          password: clave
        }
      )
      .pipe(
        tap(respuesta => {
          this.guardarToken(respuesta.access_token);
        })
      );
  }

  cargarPerfil(): Observable<PerfilUsuario> {
    return this.http
      .get<PerfilUsuario>(
        `${environment.apiUrl}/auth/profile`
      )
      .pipe(
        tap(perfil => {
          this.guardarPerfil(perfil);
        })
      );
  }

  cerrarSesion(): void {
    try {
      localStorage.removeItem(CLAVE_TOKEN);
      localStorage.removeItem(CLAVE_PERFIL);
    } catch {
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

  correoEstaDisponible(
    correo: string
  ): Observable<boolean> {
    const correoNormalizado = correo
      .trim()
      .toLowerCase();
    return this.http
      .get<UsuarioApi[]>(
        `${environment.apiUrl}/users`
      )
      .pipe(
        map(usuarios =>
          !usuarios.some(
            usuario =>
              usuario.email
                .trim()
                .toLowerCase() === correoNormalizado
          )
        )
      );
  }

  registrar(
    datos: RegistrarUsuario
  ): Observable<RegistrarUsuario> {
    return this.http.post<RegistrarUsuario>(
      `${environment.apiUrl}/users`,
      datos
    );
  }

  private guardarToken(token: string): void {
    try {
      localStorage.setItem(CLAVE_TOKEN, token);
      this.token.set(token);
    } catch {
      this.token.set(null);
    }
  }

  private guardarPerfil(perfil: PerfilUsuario): void {
    try {
      localStorage.setItem(
        CLAVE_PERFIL,
        JSON.stringify(perfil)
      );
      this.perfil.set(perfil);
    } catch {
      this.perfil.set(perfil);
    }
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
      !('role' in perfil)
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
      return JSON.parse(
        atob(partes[1])
      ) as ContenidoToken;
    } catch {
      return null;
    }
  }
}