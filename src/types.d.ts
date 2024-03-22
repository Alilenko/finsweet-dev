export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: Category;
  image: string;
  rating: Rating;
}

const enum Category {
  Electronics = 'electronics',
  Jewelery = 'jewelery',
  MenSClothing = "men's clothing",
  WomenSClothing = "women's clothing",
}

interface Rating {
  rate: number;
  count: number;
}

interface Small {
  url: string;
  width: number;
  height: number;
}
interface Thumbnails {
  small: Small;
  large: Small;
  full: Small;
}
interface Image {
  id: string;
  width: number;
  height: number;
  url: string;
  filename: string;
  size: number;
  type: string;
  thumbnails: Thumbnails;
}
export interface Fields {
  Materials: string[];
  Size: string;
  Price: number;
  Link: string;
  Name: string;
  Category: string;
  Orders?: string[];
  Images: Image[];
  Description: string;
  Settings: string[];
  Vendor: string[];
  Color: string[];
  Designer?: string[];
  'In stock'?: boolean;
  'Total units sold': number;
  'Gross sales': number;
  Notes?: string;
}
export interface Record {
  id: string;
  createdTime: string;
  fields: Fields;
}
export interface RootObject {
  records: Record[];
}
