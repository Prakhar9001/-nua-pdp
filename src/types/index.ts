export interface ProductVariant {
  id: string;
  colour: string;
  colourHex: string;
  size: string;
  stock: number;
  price: number;
  originalPrice?: number;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  description: string;
  images: string[];
  specifications: { key: string; value: string }[];
  variants: ProductVariant[];
  deliveryEstimate: string;
}

export interface CartItem {
  variantId: string;
  productId: string;
  productName: string;
  colour: string;
  size: string;
  quantity: number;
  price: number;
  image: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  body: string;
  verified: boolean;
}
