# 📦 StockMind - Frontend

> SaaS de gestión de inventario y logística inteligente para abarrotes y cremerías, diseñado bajo un enfoque híbrido **Manual + IA**.

StockMind permite administrar inventarios, almacenes, órdenes de compra y operaciones logísticas, incorporando capacidades de inteligencia artificial para automatizar procesos como el escaneo y procesamiento de facturas.

El sistema soporta **presentaciones y conversiones multinivel** —cajas, carteras, piezas y productos a granel—, además de control de devoluciones, mermas, existencias y administración multialmacén.

Este repositorio contiene la aplicación cliente web, construida bajo una arquitectura **Polyrepo** desacoplada.

---

## ✨ Características Principales

- 📦 **Gestión de inventario**
  - Catálogo de productos.
  - Existencias por almacén.
  - Control de presentaciones.
  - Conversiones multinivel.
  - Productos vendidos por pieza, caja, cartera o granel.

- 🏢 **Administración multialmacén**
  - Consulta consolidada de existencias.
  - Inventario independiente por almacén.
  - Configuración de almacenes.
  - Banderas y configuración para POS.

- 🧾 **Escáner inteligente de facturas**
  - Carga de documentos mediante Dropzone.
  - Procesamiento mediante visión / IA.
  - Extracción de partidas.
  - Validación de productos y cantidades.
  - Flujo híbrido entre procesamiento automático y corrección manual.

- 🛒 **Órdenes de compra**
  - Gestión de proveedores.
  - Seguimiento por estado.
  - KPIs de compras.
  - Generación y administración de órdenes.

- ↩️ **Devoluciones y mermas**
  - Control de devoluciones.
  - Registro de mermas.
  - Identificación de movimientos que afectan existencias.

- 🤖 **Integración con IA**
  - Automatización de procesos operativos.
  - Procesamiento inteligente de documentos.
  - Arquitectura preparada para incorporar nuevas capacidades de IA.

- 📱 **Interfaz responsive**
  - Sidebar adaptable.
  - Navegación optimizada para escritorio y dispositivos móviles.
  - Dark Mode como experiencia visual principal.

---

## 🛠️ Tecnologías y Stack

| Tecnología | Uso |
|---|---|
| **Angular 21+** | Framework principal |
| **Standalone Components** | Arquitectura de componentes |
| **Angular Signals** | Estado reactivo |
| **SignalStore / Custom Stores** | Gestión de estado |
| **Angular Control Flow** | `@if`, `@for`, etc. |
| **Tailwind CSS v4** | Sistema de estilos |
| **PrimeNG** | Componentes UI |
| **Lucide Icons** | Iconografía |
| **Node.js 22+** | Entorno de ejecución y build |
| **Nginx Alpine** | Servidor de producción |
| **Docker** | Contenedorización |
| **Vercel** | Despliegue objetivo |

---

## 🏗️ Arquitectura

StockMind utiliza una arquitectura **Polyrepo**, manteniendo desacoplada la aplicación frontend de los servicios backend.

```text
┌─────────────────────────────────────┐
│           StockMind Frontend        │
│              Angular               │
└──────────────────┬──────────────────┘
                   │
                   │ HTTP / API
                   ▼
┌─────────────────────────────────────┐
│            Backend API              │
│              .NET                   │
└──────────────────┬──────────────────┘
                   │
                   ▼
┌─────────────────────────────────────┐
│            PostgreSQL               │
└─────────────────────────────────────┘
```

La aplicación frontend está preparada para consumir servicios HTTP proporcionados por un backend desarrollado con **C# / .NET**, manteniendo responsabilidades y ciclos de despliegue independientes.

---

## 📁 Estructura del Proyecto

```text
├── Dockerfile
├── nginx.conf
├── .dockerignore
├── package.json
├── angular.json
└── src/
    ├── app/
    │   ├── config/
    │   │   # Rutas y providers globales de Angular
    │   │
    │   ├── core/
    │   │   ├── models/
    │   │   │   ├── inventory.model.ts
    │   │   │   ├── orders.model.ts
    │   │   │   └── warehouse.model.ts
    │   │   │
    │   │   ├── services/
    │   │   │   # Servicios HTTP e integración con IA
    │   │   │
    │   │   └── stores/
    │   │       ├── order.store.ts
    │   │       └── warehouse.store.ts
    │   │
    │   ├── features/
    │   │   ├── auth/
    │   │   │   # Login y registro
    │   │   │
    │   │   ├── dashboard/
    │   │   │   # KPIs, métricas y alertas
    │   │   │
    │   │   ├── inventory/
    │   │   │   # Productos, existencias y devoluciones
    │   │   │
    │   │   ├── orders/
    │   │   │   # Órdenes de compra y proveedores
    │   │   │
    │   │   ├── scanner/
    │   │   │   # Escáner de facturas mediante IA
    │   │   │
    │   │   └── warehouses/
    │   │       # Administración de almacenes
    │   │
    │   └── shared/
    │       ├── layout/
    │       ├── sidebar/
    │       └── topbar/
    │
    └── styles.css
        # Estilos globales y configuración de Tailwind CSS v4
```

---

## 🚀 Guía de Inicio Rápido

### Requisitos Previos

Antes de ejecutar el proyecto necesitas:

- **Node.js:** v22 o superior
- **npm:** v10 o superior
- **Git**
- **Docker Desktop:** opcional, para ejecutar el proyecto mediante contenedor

Puedes comprobar las versiones instaladas:

```bash
node --version
npm --version
```

---

## 💻 Opción 1: Desarrollo Local

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/stockmind-frontend.git
cd stockmind-frontend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Iniciar el servidor de desarrollo

```bash
npm start
```

La aplicación estará disponible en:

```text
http://localhost:4200
```

Angular proporciona **Hot Reload**, por lo que los cambios realizados en el código se reflejan automáticamente durante el desarrollo.

---

## 🐳 Opción 2: Ejecución con Docker

El proyecto incluye un `Dockerfile` optimizado mediante un **Multi-Stage Build**.

### Arquitectura del contenedor

```text
┌─────────────────────────────────────┐
│         Stage 1 - Build             │
│                                     │
│ Node.js 22                          │
│ npm install                         │
│ Angular build                       │
└──────────────────┬──────────────────┘
                   │
                   │ dist/
                   ▼
┌─────────────────────────────────────┐
│        Stage 2 - Runtime            │
│                                     │
│ Nginx Alpine                        │
│ Archivos estáticos                  │
│ SPA fallback → index.html           │
└─────────────────────────────────────┘
```

### 1. Construir la imagen

```bash
docker build -t stockmind-frontend .
```

### 2. Ejecutar el contenedor

```bash
docker run -d \
  -p 4200:80 \
  --name stockmind-frontend-container \
  stockmind-frontend
```

### 3. Acceder a la aplicación

Abre:

```text
http://localhost:4200
```

### Detener el contenedor

```bash
docker stop stockmind-frontend-container
```

### Eliminar el contenedor

```bash
docker rm stockmind-frontend-container
```

---

## 🌐 Nginx y SPA Routing

La aplicación utiliza Angular con navegación del lado del cliente.

Por este motivo, Nginx está configurado para devolver `index.html` cuando una ruta no corresponde directamente con un archivo físico.

Ejemplo:

```text
/dashboard
/inventory
/orders
/warehouses
```

Si el usuario accede directamente a cualquiera de estas rutas, Nginx debe resolver la petición hacia:

```text
index.html
```

Esto permite que Angular Router se encargue posteriormente de resolver la navegación.

---

## 🎨 Sistema de Diseño

StockMind utiliza un sistema visual basado principalmente en **Tailwind CSS v4** y un esquema Dark Mode.

### 🎨 Paleta

| Elemento | Clase |
|---|---|
| Fondo principal | `bg-zinc-950` |
| Tarjetas / superficies | `bg-zinc-900/50` |
| Bordes principales | `border-zinc-800` |
| Bordes interactivos | `border-zinc-700` |
| Acciones positivas | `emerald-500` |
| Alertas / edición manual | `amber-400` |
| Acciones destructivas / mermas | `rose-400` |

### Filosofía visual

El diseño busca mantener una interfaz:

- Minimalista.
- Orientada a datos.
- Consistente.
- Optimizada para operaciones administrativas.
- Con jerarquía visual clara.
- Adaptable a escritorio y dispositivos móviles.

---

## 🧩 Componentes UI

El frontend utiliza:

### PrimeNG

Utilizado para componentes complejos de interfaz como:

- Tablas.
- Dialogs.
- Formularios.
- Selectores.
- Overlays.
- Componentes interactivos.

### Lucide Icons

Utilizado como sistema principal de iconografía para:

- Navegación.
- Acciones.
- Estados.
- Botones.
- Indicadores visuales.

---

## 📐 Convenciones de Código

### Componentes

Se utiliza una nomenclatura simplificada sin el sufijo `.component`.

```text
inventory-table.ts
inventory-table.html
inventory-table.css
```

En lugar de:

```text
inventory-table.component.ts
inventory-table.component.html
inventory-table.component.css
```

---

## ⚡ Estado Reactivo

La aplicación utiliza las capacidades modernas de reactividad de Angular.

### Signals

```ts
const products = signal<Product[]>([]);
```

### Computed

```ts
const totalProducts = computed(() => products().length);
```

### Inputs

```ts
readonly product = input.required<Product>();
```

### Outputs

```ts
readonly productSelected = output<Product>();
```

Para estados compartidos y lógica de dominio se utilizan **SignalStore / Custom Stores**.

Ejemplo:

```text
core/
└── stores/
    ├── order.store.ts
    └── warehouse.store.ts
```

---

## 🧠 Arquitectura de Features

Las funcionalidades principales están organizadas por dominio:

```text
features/
├── auth/
├── dashboard/
├── inventory/
├── orders/
├── scanner/
└── warehouses/
```

Cada feature mantiene encapsulada su lógica relacionada con:

- Componentes.
- Vistas.
- Estado específico.
- Modelos.
- Servicios.
- Flujos de usuario.

Esto permite mantener el código desacoplado y facilita la evolución independiente de cada módulo.

---

## 📦 Gestión de Inventario

El módulo de inventarios contempla diferentes niveles de presentación y conversión.

Ejemplo conceptual:

```text
1 Caja
   └── 12 Carteras
         └── 10 Piezas
```

Esto permite manejar productos comercializados en diferentes unidades y realizar conversiones para mantener las existencias correctamente normalizadas.

También contempla productos vendidos por:

- Pieza.
- Caja.
- Cartera.
- Peso / granel.

---

## 🧾 Escáner de Facturas + IA

El módulo de scanner está diseñado para implementar un flujo híbrido:

```text
Factura
   │
   ▼
┌─────────────────┐
│ Upload / Dropzone│
└────────┬────────┘
         ▼
┌─────────────────┐
│ Procesamiento IA│
└────────┬────────┘
         ▼
┌─────────────────┐
│ Partidas extraídas│
└────────┬────────┘
         ▼
┌─────────────────┐
│ Validación       │
│ automática/manual│
└────────┬────────┘
         ▼
┌─────────────────┐
│ Inventario       │
└─────────────────┘
```

El usuario puede validar o corregir la información obtenida antes de incorporarla al flujo de inventario.

---

## 🏢 Gestión Multialmacén

StockMind permite consultar y administrar existencias asociadas a diferentes almacenes.

Conceptualmente:

```text
                StockMind
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
    Almacén A   Almacén B   Almacén C
        │           │           │
        ▼           ▼           ▼
     Stock       Stock       Stock
```

Esto permite construir una vista consolidada de existencias y preparar la integración futura con operaciones de **POS / TPV**.

---

## 📊 Estado del Proyecto

| Módulo / Funcionalidad | Estado | Descripción |
|---|---|---|
| **Landing, Auth & Layout** | ✅ Completo | Pantallas públicas, autenticación, Sidebar interactivo y navegación responsive. |
| **Inventarios & Almacenes** | ✅ Completo | Catálogo de productos, filtros multialmacén y consulta de stock agrupado. |
| **Escáner de Facturas** | ✅ Completo | Dropzone, tabla de partidas escaneadas y validación de partidas híbridas. |
| **Órdenes de Compra** | ✅ Completo | KPIs de compras, filtrado por estado y generación de órdenes. |
| **Dockerización Frontend** | ✅ Completo | Multi-stage build con Node.js + Nginx Alpine y routing SPA. |
| **Punto de Venta (TPV / POS)** | 🚧 Pendiente | Interfaz de ventas con descuento automático de existencias por almacén. |
| **Conexión Web API .NET** | 🚧 Pendiente | Integración HTTP con backend C# .NET y PostgreSQL. |

---

## 🔮 Roadmap

### Fase 1 — Frontend

- [x] Landing Page
- [x] Autenticación
- [x] Layout principal
- [x] Dashboard
- [x] Inventarios
- [x] Almacenes
- [x] Órdenes de compra
- [x] Escáner de facturas
- [x] Dockerización
- [ ] Punto de Venta / TPV

### Fase 2 — Backend

- [ ] Web API con .NET
- [ ] Autenticación y autorización
- [ ] Gestión de productos
- [ ] Gestión de inventarios
- [ ] Gestión de almacenes
- [ ] Gestión de proveedores
- [ ] Órdenes de compra
- [ ] Devoluciones
- [ ] Mermas
- [ ] API para procesamiento de IA

### Fase 3 — Persistencia

- [ ] PostgreSQL
- [ ] Migraciones
- [ ] Relaciones entre productos y presentaciones
- [ ] Existencias por almacén
- [ ] Historial de movimientos
- [ ] Auditoría

### Fase 4 — IA

- [ ] Procesamiento de facturas
- [ ] Extracción de partidas
- [ ] Matching inteligente de productos
- [ ] Detección de inconsistencias
- [ ] Automatización de captura
- [ ] Asistente inteligente para inventarios

---

## 🔐 Seguridad

Las credenciales, API keys y variables sensibles **no deben almacenarse directamente en el repositorio**.

Utiliza variables de entorno para configurar:

```text
API_URL
AI_API_KEY
AUTH_CONFIG
DATABASE_CONFIG
```

El archivo `.env` debe mantenerse fuera del control de versiones cuando contenga información sensible.

---

## 🚀 Despliegue

El proyecto está preparado para dos escenarios principales:

### Vercel

```text
Git Repository
       │
       ▼
    Vercel
       │
       ▼
 Angular Build
       │
       ▼
   Static SPA
```

### Docker

```text
Git Repository
       │
       ▼
 Docker Build
       │
       ▼
 Node.js Build
       │
       ▼
 Nginx Alpine
       │
       ▼
   Production
```

---

## 📌 Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm start` | Inicia el servidor de desarrollo |
| `npm run build` | Genera el build de producción |
| `npm test` | Ejecuta las pruebas |
| `npm run lint` | Ejecuta validaciones de linting |

> Los scripts disponibles pueden variar según la configuración actual de `package.json`.

---

## 📄 Licencia

Este proyecto es de uso privado y se encuentra actualmente en desarrollo.

La licencia y condiciones de distribución podrán definirse posteriormente.

---

## 👨‍💻 StockMind

**StockMind** busca combinar la gestión tradicional de inventarios con automatización basada en IA para reducir tareas manuales y facilitar la operación diaria de abarrotes y cremerías.

```text
Manual + IA
     │
     ├── Inventario
     ├── Almacenes
     ├── Compras
     ├── Facturas
     ├── Devoluciones
     ├── Mermas
     └── POS
```

**StockMind — Inventario inteligente para una operación más eficiente.** 📦⚡