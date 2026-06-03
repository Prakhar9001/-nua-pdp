import type { ProductVariant } from '../types';

export const mockVariants: ProductVariant[] = [
  { id: 'lp1', colour: 'Light Pink',   colourHex: '#F2B8C4', size: 'XS', stock: 8,  price: 599, originalPrice: 699 },
  { id: 'lp2', colour: 'Light Pink',   colourHex: '#F2B8C4', size: 'S',  stock: 2,  price: 599, originalPrice: 699 },
  { id: 'lp3', colour: 'Light Pink',   colourHex: '#F2B8C4', size: 'M',  stock: 5,  price: 599, originalPrice: 699 },
  { id: 'lp4', colour: 'Light Pink',   colourHex: '#F2B8C4', size: 'L',  stock: 0,  price: 599, originalPrice: 699 },
  { id: 'lp5', colour: 'Light Pink',   colourHex: '#F2B8C4', size: 'XL', stock: 3,  price: 599, originalPrice: 699 },
  { id: 'lg1', colour: 'Lemon Green',  colourHex: '#D4E8A0', size: 'XS', stock: 6,  price: 599, originalPrice: 699 },
  { id: 'lg2', colour: 'Lemon Green',  colourHex: '#D4E8A0', size: 'S',  stock: 4,  price: 599, originalPrice: 699 },
  { id: 'lg3', colour: 'Lemon Green',  colourHex: '#D4E8A0', size: 'M',  stock: 0,  price: 599, originalPrice: 699 },
  { id: 'lg4', colour: 'Lemon Green',  colourHex: '#D4E8A0', size: 'L',  stock: 3,  price: 599, originalPrice: 699 },
  { id: 'lg5', colour: 'Lemon Green',  colourHex: '#D4E8A0', size: 'XL', stock: 2,  price: 599, originalPrice: 699 },
  { id: 'pu1', colour: 'Light Purple', colourHex: '#D4B8E0', size: 'XS', stock: 10, price: 599 },
  { id: 'pu2', colour: 'Light Purple', colourHex: '#D4B8E0', size: 'S',  stock: 7,  price: 599 },
  { id: 'pu3', colour: 'Light Purple', colourHex: '#D4B8E0', size: 'M',  stock: 2,  price: 599 },
  { id: 'pu4', colour: 'Light Purple', colourHex: '#D4B8E0', size: 'L',  stock: 0,  price: 599 },
  { id: 'pu5', colour: 'Light Purple', colourHex: '#D4B8E0', size: 'XL', stock: 5,  price: 599 },
];

export const colourImages: Record<string, string[]> = {
  'Light Pink':   ['/underwear-light-pink.webp',   '/underwear-lemon-green.webp',  '/underwear-light-purple.webp'],
  'Lemon Green':  ['/underwear-lemon-green.webp',  '/underwear-light-purple.webp', '/underwear-light-pink.webp'],
  'Light Purple': ['/underwear-light-purple.webp', '/underwear-light-pink.webp',   '/underwear-lemon-green.webp'],
};
