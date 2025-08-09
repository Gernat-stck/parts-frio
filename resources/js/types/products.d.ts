export interface Product {
    id: number;
    product_name: string;
    product_code: string;
    description: string;
    price: number;
    stock: number;
    min_stock: number;
    img_product: string;
    category: string;
}

export interface ProductData {
    //Para el formato de facturacion
    id: number;
    product_name: string;
    product_code: string;
    category: string;
    tipo_item: number;
    description: string;
    stock: number;
    ivaItem: number;
    price: number;
    precioUni: number;
    img_product: string;
    min_stock: number;
    max_stock: number;
    cantidad?: number; // Optional field for quantity
    uniMedida?: number; // Optional field for unit of measure
    ventaExenta?: number; // Optional field for exempt sales
    ventaGravada?: number; // Optional field for taxed sales
    tributos?: Record<string, unknown> | Array<unknown> | null; // Optional field for taxes
    montoDescu?: number; // Optional field for discount amount
    ventaNoSuj?: number;
    psv?: number;
    noGravado?: number;
}
