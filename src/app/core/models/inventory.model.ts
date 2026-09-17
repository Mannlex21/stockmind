export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  stock: number;
  minStock: number;
  unitPrice: number;
  supplier: string;
  lastUpdated: Date;
}

export interface PurchaseOrderItem {
  productId: string;
  productName: string;
  quantityToOrder: number;
  estimatedCost: number;
  supplier: string;
}

export interface PurchaseOrder {
  id: string;
  date: Date;
  items: PurchaseOrderItem[];
  totalCost: number;
  status: 'draft' | 'sent' | 'completed';
}
