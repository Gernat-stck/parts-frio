import { Customer, Seller } from "./invoice-persons";
import { Product } from "./products";

export interface Sale {
    id: string;
    date: string;
    seller: Seller;
    customer: Customer;
    items: CartItem[];
    subtotal: number;
    tax: number;
    total: number;
    status: 'completed' | 'pending';
}

export interface CartItem extends Product {
    quantity: number;
    subtotal: number;
}
