/**
 * Nivel o estado del stock calculado para un producto en catálogo.
 * - `IN_STOCK`: Existencias dentro de márgenes normales.
 * - `LOW_STOCK`: Existencias iguales o por debajo del umbral mínimo configurado.
 * - `OUT_OF_STOCK`: Sin existencias disponibles en almacén.
 */
export type ProductStatus = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';

/**
 * Modo u origen con el que se realizó el registro o captura de datos.
 * - `MANUAL`: Capturado manualmente por un usuario operador.
 * - `AI_GENERATED`: Generado o extraído automáticamente por la integración de IA (Gemini).
 * - `AI_EDITED`: Generado inicialmente por IA y corregido/verificado posteriormente por un usuario.
 */
export type DataEntryMode = 'MANUAL' | 'AI_GENERATED' | 'AI_EDITED';

/**
 * Unidades de medida estandarizadas para el conteo e inventario base.
 * - `PCS`: Piezas / Unidades individuales.
 * - `KG`: Kilogramos.
 * - `G`: Gramos.
 * - `L`: Litros.
 * - `ML`: Mililitros.
 */
export type UnitOfMeasure = 'PCS' | 'KG' | 'G' | 'L' | 'ML';

/**
 * Clasificación del flujo de devolución de mercancía.
 * - `CUSTOMER_RETURN`: Devolución realizada por un cliente hacia la tienda.
 * - `SUPPLIER_RETURN`: Devolución de producto defectuoso o mermado hacia el proveedor.
 */
export type ReturnType = 'CUSTOMER_RETURN' | 'SUPPLIER_RETURN';

/**
 * Motivo o causa justificada para el registro de devoluciones, mermas o ajustes.
 * - `DAMAGED`: Producto maltratado, roto o dañado en traslado/exhibición.
 * - `EXPIRED`: Producto caducado o fuera de fecha de consumo.
 * - `WRONG_ITEM`: Error de empaque, surtido o envío incorrecto.
 * - `CUSTOMER_REFUND`: Reembolso comercial a cliente por insatisfacción o garantía.
 */
export type ReturnReason = 'DAMAGED' | 'EXPIRED' | 'WRONG_ITEM' | 'CUSTOMER_REFUND';

/**
 * Distribución de existencias físicas de un producto desglosadas por almacén o bodega.
 */
export interface WarehouseStock {
  /** Identificador único del almacén de ubicación */
  warehouseId: string;

  /** Nombre o descripción identificadora del almacén (ej. Bodega Central, Exhibición) */
  warehouseName: string;

  /** Cantidad física actualmente en existencia dentro de esta ubicación */
  stock: number;
}

/**
 * Control de lote y fecha de vencimiento para productos con trazabilidad o perecederos.
 */
export interface ProductBatch {
  /** Identificador único del registro de lote */
  id: string;

  /** Código, folio o número de lote asignado por el fabricante */
  batchNumber: string;

  /** Fecha de caducidad o vencimiento del lote */
  expirationDate: Date | string;

  /** Cantidad física asignada a este lote específico */
  quantity: number;

  /** Identificador opcional del almacén donde está resguardado el lote (opcional) */
  warehouseId?: string;
}

/**
 * Presentación o empaque alternativo/secundario de un producto (ej. Caja de 24 pzas, Cartera, Pack).
 */
export interface ProductPresentation {
  /** Identificador único de la presentación */
  id: string;

  /** Nombre descriptivo de la presentación (ej. Caja con 12 pzas) */
  name: string;

  /** ID de la presentación padre en caso de jerarquías multinivel compuestas (opcional) */
  parentPresentationId?: string;

  /** Factor de conversión multiplicador a la unidad de medida base */
  baseConversionFactor: number;

  /** Precio de venta antes de impuestos para esta presentación */
  price: number;

  /** Precio de venta público con impuestos (IVA) incluidos (opcional) */
  priceWithTax?: number;

  /** Código de barras secundario (EAN/UPC) atribuido al empaque completo (opcional) */
  barcode?: string;

  /** Referencia o código SKU interno propio de la presentación (opcional) */
  sku?: string;
}

/**
 * Ficha técnica y registro principal del Producto en el catálogo ERP.
 */
export interface Product {
  /** Identificador único del producto en la base de datos */
  id: string;

  /** Código de referencia interna o SKU del producto */
  sku: string;

  /** Códigos de barras (EAN/UPC) alternativos o primarios del producto (opcional) */
  barcodes?: string[];

  /** Nombre principal o descripción comercial del producto */
  name: string;

  /** Marca comercial o fabricante del producto (opcional) */
  brand?: string;

  /** Categoría o familia principal de catálogo */
  category: string;

  /** Subcategoría o clasificación secundaria de catálogo (opcional) */
  subcategory?: string;

  // --- FLAGS DE OPERACIÓN ---
  /** Indica si el producto está disponible para operaciones en el sistema */
  isActive: boolean;

  /** Habilita el producto para ser buscado y vendido en la pantalla de Punto de Venta (TPV / POS) */
  useInPOS: boolean;

  /** Define si el producto controla inventario (falso en servicios o cobros intangibles) */
  trackStock: boolean;

  // --- UNIDAD DE MEDIDA ---
  /** Unidad de medida estándar usada para el conteo en inventario base */
  baseUnit: UnitOfMeasure;

  // --- EXISTENCIAS Y FLUJOS ---
  /** Suma consolidada de existencias físicas entre todos los almacenes */
  stock: number;

  /** Unidades compradas en órdenes de compra pendientes de recibir de proveedores */
  pendingToReceive: number;

  /** Unidades comprometidas en pedidos pendientes de entregar a clientes */
  pendingToServe: number;

  /** Total acumulado histórico de entradas registradas al inventario (opcional) */
  accumulatedEntries?: number;

  /** Total acumulado histórico de salidas registradas del inventario (opcional) */
  accumulatedExits?: number;

  /** Nivel de existencias mínimo para disparar alertas de reabastecimiento */
  minStock: number;

  /** Nivel de existencias máximo recomendado para evitar sobrestock (opcional) */
  maxStock?: number;

  // --- COSTES, PRECIOS E IMPUESTOS ---
  /** Costo de adquisición unitario sin impuestos */
  costPrice: number;

  /** Costo de adquisición unitario con IVA u otros impuestos incluidos (opcional) */
  costPriceWithTax?: number;

  /** Precio de venta unitario antes de impuestos */
  unitPrice: number;

  /** Precio de venta público final con impuestos incluidos */
  unitPriceWithTax: number;

  /** Porcentaje de impuesto IVA aplicable al producto (ej. 16, 0) */
  taxRate: number;

  // --- CONFIGURACIONES DE TRAZABILIDAD ---
  /** Habilita el registro de lotes y fechas de vencimiento al ingresar stock (opcional) */
  useBatchExpiration?: boolean;

  /** Habilita la captura obligatoria de números de serie por unidad (opcional) */
  useSerialNumbers?: boolean;

  // --- RELACIONES MULTINIVEL ---
  /** Desglose detallado de existencias físicas por almacén (opcional) */
  stocksByWarehouse?: WarehouseStock[];

  /** Colección de lotes activos registrados para este producto (opcional) */
  batches?: ProductBatch[];

  /** Presentaciones o empaques secundarios asociados a este producto (opcional) */
  presentations?: ProductPresentation[];

  // --- METADATOS ---
  /** Nombre o razón social del proveedor principal asignado */
  supplier: string;

  /** Fecha y hora de la última modificación en la ficha del producto */
  lastUpdated: Date | string;

  /** Origen del alta de la información (Manual, IA o IA Editada) (opcional) */
  entryMode?: DataEntryMode;

  /** Estado actual calculado de las existencias del producto (opcional) */
  status?: ProductStatus;
}

/**
 * Registro de movimiento por devolución o merma de producto.
 */
export interface ReturnTransaction {
  /** Identificador único de la transacción de devolución */
  id: string;

  /** Identificador del producto afectado */
  productId: string;

  /** Nombre del producto grabado al momento de la devolución */
  productName: string;

  /** Clasificación de la devolución (Cliente o Proveedor) */
  type: ReturnType;

  /** Motivo o causa documentada de la devolución o merma */
  reason: ReturnReason;

  /** Identificador de la presentación devuelta si no fue en unidad base (opcional) */
  presentationId?: string;

  /** Cantidad física devuelta expresada en la presentación seleccionada */
  quantityReturned: number;

  /** Cantidad equivalente recalculada en la unidad de medida base */
  baseQuantity: number;

  /** Indica si la mercancía vuelve a sumarse al stock vendible o se descarta */
  restockInventory: boolean;

  /** Importe o valor monetario total correspondiente a la transacción */
  totalAmount: number;

  /** Fecha y hora en la que se efectuó el registro */
  date: Date | string;

  /** Notas explicativas o detalles sobre la condición del artículo (opcional) */
  notes?: string;

  /** Origen de la captura de los datos de la devolución (opcional) */
  entryMode?: DataEntryMode;
}

/**
 * Partida individual procesada durante el escaneo OCR/IA de una factura.
 */
export interface InvoiceItemScan {
  /** Descripción o concepto tal como aparece impreso en el comprobante */
  description: string;

  /** Referencia o SKU detectado en el comprobante (opcional) */
  sku?: string;

  /** Cantidad de artículos o paquetes facturados */
  quantity: number;

  /** Precio unitario registrado en la factura */
  unitPrice: number;

  /** Importe total de la partida sin/con impuestos segun comprobante */
  totalPrice: number;

  /** Presentación identificada automáticamente por el motor de IA (opcional) */
  detectedPresentation?: string;

  /** ID del producto en el catálogo ERP enlazado por coincidencia (opcional) */
  matchedProductId?: string;

  /** Nivel de confianza (0.0 a 1.0) asignado por la IA al vincular el producto (opcional) */
  confidenceScore?: number;

  /** Bandera que confirma si el operador validó manualmente la coincidencia */
  isManuallyVerified: boolean;
}

/**
 * Objeto con los datos extraídos de una factura o nota de venta tras el escaneo por IA.
 */
export interface InvoiceScanResult {
  /** Número o folio del comprobante extraído */
  invoiceNumber: string;

  /** Nombre o razón social del emisor/proveedor detectado */
  supplierName: string;

  /** Fecha de emisión del documento en formato texto/ISO */
  issueDate: string;

  /** Monto total facturado validado */
  totalAmount: number;

  /** Colección de partidas desglosadas leídas del documento */
  items: InvoiceItemScan[];

  /** Texto plano completo procesado durante la lectura OCR (opcional) */
  rawText?: string;
}

/**
 * Indicadores métricos generales del módulo de inventarios para paneles y dashboards.
 */
export interface InventoryStats {
  /** Número total de productos dados de alta en el catálogo */
  totalProducts: number;

  /** Número de productos con alerta por bajo stock o agotados */
  lowStockCount: number;

  /** Valor monetario total del inventario acumulado a precio de coste */
  totalValue: number;

  /** Cantidad de órdenes de compra pendientes por surtir */
  pendingOrders: number;
}
