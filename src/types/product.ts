export interface Product {
    id: string;
    name: string;
    gender: "MEN" | "WOMEN";
    category: string;
    subcategory: string;
    price: number;
    isNew: boolean;
    discount: number;
    image: string;
    description: string;
    colors: string[];
    sizes: string[];
  }