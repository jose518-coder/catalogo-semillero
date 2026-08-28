import { Producto } from '../models/producto';

export const PRODUCTOS: Producto[] =[
    {
    id: 1,
    title: 'Teclado mecánico',
    price: 250000,
    description: 'Teclado mecánico para gaming',
    images: ['https://example.com/teclado.jpg'],
    stock: 10,
    category: {
      id: 1,
      name: 'Electrónica'
    }
  },
  {
    id: 2,
    title: 'Mouse',
    price: 150000,
    description: 'Mouse para gaming',
    images: ['https://example.com/mouse.jpg'],
    stock: 5,
    category: {
      id: 1,
      name: 'Electrónica'
    }
  },
  {
    id: 3,
    title: 'Teclado ergonomico',
    price: 250000,
    description: 'Teclado ergonomico',
    images: ['https://example.com/teclado1.jpg'],
    stock: 16,
    category: {
      id: 1,
      name: 'Electrónica'
    }
  },
  {
    id: 4,
    title: 'camisa',
    price: 250000,
    description: 'prenda superior',
    images: ['https://example.com/camisa.jpg'],
    stock: 10,
    category: {
      id: 2,
      name: 'ropa'
    }
  },
  {
    id: 5,
    title: 'Jeans',
    price: 50000,
    description: 'prenda inferior',
    images: ['https://example.com/jeans.jpg'],
    stock: 10,
    category: {
      id: 2,
      name: 'ropa'
    }
  },
  {
    id: 6,
    title: 'Nevera',
    price: 1250000,
    description: 'enfriador',
    images: ['https://example.com/nevera.jpg'],
    stock: 0,
    category: {
      id: 3,
      name: 'Electrodomestico'
    }
  }
]; 