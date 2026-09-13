export interface ActualizarProducto {
  id: number;
  title?: string;
  price?: number;
  description?: string;
  images?: string[];
  categoryId?: number;
}