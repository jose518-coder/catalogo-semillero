export interface Producto {
  id: number;
  titulo: string;
  precio: number;
  description: string;
  images: string[];
  stock: number;
  category: { id: number; name: string };
}
