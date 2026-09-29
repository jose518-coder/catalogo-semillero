export interface Producto {
  id: number;
  titulo: string;
  precio: number;
  existencias: number;
  categoriaId: number;
  categoria: string;
  descripcion: string;
  imagenes: string[];
}
