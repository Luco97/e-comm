export interface ProductJSON {
  [key: string]: meta;
}

interface meta {
  value: number;
  quantity: number;
  discount: number;
  variation: string;
}
