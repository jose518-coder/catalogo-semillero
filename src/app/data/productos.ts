import { Producto } from '../models/producto';

export const PRODUCTOS: Producto[] =[
    {
    id: 1,
    titulo: 'Teclado mecánico',
    precio: 250000,
    descripcion: 'Teclado mecánico para gaming',
    imagenes: ['https://example.com/teclado.jpg'],
    existencias: 10,
    categoriaId: 1,
    categoria: 'Electrónica'
  },
  {
    id: 2,
    titulo: 'Mouse',
    precio: 150000,
    descripcion: 'Mouse para gaming',
    imagenes: ['https://example.com/mouse.jpg'],
    existencias: 5,
    categoriaId: 1,
    categoria: 'Electrónica'
  },
  {
    id: 3,
    titulo: 'Teclado ergonomico',
    precio: 250000,
    descripcion: 'Teclado ergonomico',
    imagenes: ['https://example.com/teclado1.jpg'],
    existencias: 16,
    categoriaId: 1,
    categoria: 'Electrónica'
  },
  {
    id: 4,
    titulo: 'camisa',
    precio: 250000,
    descripcion: 'prenda superior',
    imagenes: ['https://example.com/camisa.jpg'],
    existencias: 10,
    categoriaId: 2,
    categoria: 'ropa'
  },
  {
    id: 5,
    titulo: 'Jeans',
    precio: 50000,
    descripcion: 'prenda inferior',
    imagenes: ['https://example.com/jeans.jpg'],
    existencias: 10,
    categoriaId: 2,
    categoria: 'ropa'
  },
  {
    id: 6,
    titulo: 'Nevera',
    precio: 1250000,
    descripcion: 'enfriador',
    imagenes: ['https://example.com/nevera.jpg'],
    existencias: 0,
    categoriaId: 3,
    categoria: 'Electrodomestico'
  }
]; 
