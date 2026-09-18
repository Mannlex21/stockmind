/**
 * Estados posibles del inventario de un producto.
 */
export type ProductStatus = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';

/**
 * Estados de las órdenes de compra a proveedores.
 */
export type OrderStatus = 'draft' | 'sent' | 'completed';

/**
 * Origen de la captura de información en el sistema.
 */
export type DataEntryMode = 'MANUAL' | 'AI_GENERATED' | 'AI_EDITED';

/**
 * Unidades de medida estandarizadas para el inventario base.
 */
export type UnitOfMeasure = 'PCS' | 'KG' | 'G' | 'L' | 'ML';

/**
 * Tipos de devolución admitidos por el ERP.
 */
export type ReturnType = 'CUSTOMER_RETURN' | 'SUPPLIER_RETURN';

/**
 * Razones principales para el registro de devoluciones o mermas.
 */
export type ReturnReason = 'DAMAGED' | 'EXPIRED' | 'WRONG_ITEM' | 'CUSTOMER_REFUND';

/**
 * Distribución del stock disponible por almacén o ubicación física.
 */
export interface WarehouseStock {
  /** Identificador único del almacén */
  warehouseId: string;
  /** Nombre o descripción del almacén (ej. Bodega Principal, Mostrar) */
  warehouseName: string;
  /** Cantidad física disponible en esta ubicación (Solo Lectura en Ficha de Producto) */
  stock: number;
}

/**
 * Información de lotes y fechas de vencimiento de productos.
 */
export interface ProductBatch {
  /** Identificador del registro de lote */
  id: string;
  /** Número de lote o código de trazabilidad del fabricante */
  batchNumber: string;
  /** Fecha de caducidad o vencimiento */
  expirationDate: Date | string;
  /** Cantidad perteneciente a este lote específico */
  quantity: number;
  /** Identificador opcional del almacén donde se ubica el lote */
  warehouseId?: string;
}

/**
 * Empaques o presentaciones secundarias de un producto (ej. Cartera, Caja, Six-pack).
 */
export interface ProductPresentation {
  /** Identificador único de la presentación */
  id: string;
  /** Nombre descriptivo (ej. Caja de 24 pzas) */
  name: string;
  /** Identificador de presentación padre (para jerarquías compuestas) */
  parentPresentationId?: string;
  /** Factor de conversión a la unidad base (ej. 24 piezas) */
  baseConversionFactor: number;
  /** Precio de venta de esta presentación sin impuestos */
  price: number;
  /** Precio de venta de esta presentación con impuestos (IVA) */
  priceWithTax?: number;
  /** Código de barras secundario o EAN para la presentación */
  barcode?: string;
  /** Referencia o código interno propio de la presentación */
  sku?: string;
}

/**
 * Ficha principal del Producto o Artículo ERP.
 */
export interface Product {
  /** Identificador único del producto en la base de datos */
  id: string;
  /** Referencia interna o código SKU del artículo */
  sku: string;
  /** Lista de códigos de barras (EAN/UPC) asociados */
  barcodes?: string[];
  /** Nombre o descripción principal del producto */
  name: string;
  /** Marca comercial del producto */
  brand?: string;
  /** Categoría principal o familia ERP */
  category: string;
  /** Subcategoría o subfamilia ERP */
  subcategory?: string;

  // --- FLAGS DE OPERACIÓN Y ESTADO ---
  /** Indica si el producto está activo para operaciones (SI / NO) */
  isActive: boolean;
  /** Indica si el producto se habilita para venta en TPV / Caja (SI / NO) */
  useInPOS: boolean;
  /** Define si el producto descuenta stock (false para servicios o intangibles) */
  trackStock: boolean;

  // --- UNIDAD DE MEDIDA ---
  /** Unidad de medida principal para el conteo de existencias */
  baseUnit: UnitOfMeasure;

  // --- EXISTENCIAS Y FLUJOS ---
  /** Existencias físicas totales en almacén */
  stock: number;
  /** Cantidad comprada pendiente por recibir de proveedores */
  pendingToReceive: number;
  /** Cantidad vendida pendiente por entregar/servir a clientes */
  pendingToServe: number;
  /** Total histórico acumulado de entradas al almacén */
  accumulatedEntries?: number;
  /** Total histórico acumulado de salidas del almacén */
  accumulatedExits?: number;
  /** Umbral mínimo de stock para lanzar alertas de reabastecimiento */
  minStock: number;
  /** Límite máximo deseado de stock en almacén */
  maxStock?: number;

  // --- COSTES, PRECIOS E IMPUESTOS ---
  /** Precio de compra / coste unitario sin IVA */
  costPrice: number;
  /** Precio de compra / coste unitario con IVA incluido */
  costPriceWithTax?: number;
  /** Precio de venta unitario sin IVA */
  unitPrice: number;
  /** Precio de venta unitario público con IVA incluido */
  unitPriceWithTax: number;
  /** Porcentaje de IVA aplicable al producto (ej. 16, 0) */
  taxRate: number;

  // --- TRAZABILIDAD Y CONFIGURACIÓN EXTRA ---
  /** Habilita el control de lote y fecha de caducidad */
  useBatchExpiration?: boolean;
  /** Habilita el registro de números de serie por unidad */
  useSerialNumbers?: boolean;

  // --- RELACIONES ---
  /** Desglose de existencias por cada almacén activo */
  stocksByWarehouse?: WarehouseStock[];
  /** Lista de lotes registrados para el producto */
  batches?: ProductBatch[];
  /** Presentaciones alternativas de empaque/venta */
  presentations?: ProductPresentation[];

  // --- METADATOS ---
  /** Nombre o razón social del proveedor principal */
  supplier: string;
  /** Fecha de la última modificación en la ficha del producto */
  lastUpdated: Date | string;
  /** Método mediante el cual se dio de alta el producto */
  entryMode?: DataEntryMode;
  /** Estado calculado del stock (En stock, Bajo stock, Agotado) */
  status?: ProductStatus;
}

/**
 * Registro individual de devolución o merma de inventario.
 */
export interface ReturnTransaction {
  /** Identificador único de la transacción */
  id: string;
  /** ID del producto afectado */
  productId: string;
  /** Nombre del producto al momento de registrar */
  productName: string;
  /** Tipo de devolución (Cliente o Proveedor) */
  type: ReturnType;
  /** Causa o motivo del movimiento */
  reason: ReturnReason;
  /** ID de la presentación usada (opcional) */
  presentationId?: string;
  /** Cantidad devuelta en la unidad/presentación seleccionada */
  quantityReturned: number;
  /** Cantidad equivalente en la unidad de medida base */
  baseQuantity: number;
  /** Indica si la cantidad devuelta vuelve a sumarse al stock vendible */
  restockInventory: boolean;
  /** Valor monetario total de la operación */
  totalAmount: number;
  /** Fecha y hora del registro */
  date: Date | string;
  /** Notas explicativas u observaciones del movimiento */
  notes?: string;
  /** Origen de la captura del registro */
  entryMode?: DataEntryMode;
}

/**
 * Elemento o línea individual dentro de una orden de compra.
 */
export interface PurchaseOrderItem {
  /** ID del producto a solicitar */
  productId: string;
  /** Nombre/descripción del producto */
  productName: string;
  /** Cantidad a pedir al proveedor */
  quantityToOrder: number;
  /** Coste estimado por unidad */
  estimatedCost: number;
  /** Nombre del proveedor de la línea */
  supplier: string;
  /** ID de presentación asociada (opcional) */
  presentationId?: string;
}

/**
 * Encabezado de orden de compra a proveedores.
 */
export interface PurchaseOrder {
  /** Folio u orden de compra */
  id: string;
  /** Fecha de emisión de la orden */
  date: Date | string;
  /** Detalle de productos incluidos en la orden */
  items: PurchaseOrderItem[];
  /** Importe total estimado de la compra */
  totalCost: number;
  /** Estado de procesamiento de la orden */
  status: OrderStatus;
}

/**
 * Resultado de lectura individual al escanear una factura de proveedor.
 */
export interface InvoiceItemScan {
  /** Texto/Descripción detectado en la factura */
  description: string;
  /** Referencia o SKU detectado */
  sku?: string;
  /** Cantidad facturada */
  quantity: number;
  /** Precio unitario en la factura */
  unitPrice: number;
  /** Importe total de la línea */
  totalPrice: number;
  /** Presentación identificada automáticamente */
  detectedPresentation?: string;
  /** ID del producto en catálogo sugerido por coincidencia */
  matchedProductId?: string;
  /** Grado de certeza de la coincidencia (0 a 1) */
  confidenceScore?: number;
  /** Bandera que indica si el operador confirmó el enlace */
  isManuallyVerified: boolean;
}

/**
 * Resultado global del procesamiento OCR/IA de una factura.
 */
export interface InvoiceScanResult {
  /** Número de factura o comprobante extraído */
  invoiceNumber: string;
  /** Nombre del emisor / proveedor */
  supplierName: string;
  /** Fecha de emisión detectada */
  issueDate: string;
  /** Monto total comprobado */
  totalAmount: number;
  /** Desglose de partidas leídas */
  items: InvoiceItemScan[];
  /** Texto plano completo leído de la factura */
  rawText?: string;
}

/**
 * Resumen de indicadores clave de rendimiento (KPIs) del inventario.
 */
export interface InventoryStats {
  /** Cantidad total de productos registrados */
  totalProducts: number;
  /** Número de productos en nivel crítico de stock */
  lowStockCount: number;
  /** Valor monetario total del stock a precio de coste */
  totalValue: number;
  /** Cantidad de órdenes de compra pendientes */
  pendingOrders: number;
}
