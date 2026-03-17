# 🚀 Proyecto Backend - Tienda con WebSockets, Handlebars y MongoDB

Este es un proyecto de backend desarrollado en Node.js utilizando Express. Implementa una arquitectura profesional conectada a una base de datos en la nube (MongoDB), un motor de plantillas (Handlebars) para la visualización del frontend y WebSockets (Socket.io) para manejar la actualización de productos en tiempo real.

## 🛠️ Tecnologías Utilizadas

* **Node.js**: Entorno de ejecución para JavaScript.
* **Express.js**: Framework para el servidor HTTP y manejo de rutas de la API.
* **MongoDB & Mongoose**: Base de datos NoSQL en la nube y ODM para modelado de datos.
* **Mongoose Paginate v2**: Plugin para el manejo profesional de paginación en consultas.
* **Handlebars**: Motor de plantillas para renderizar HTML dinámico.
* **Socket.io**: Librería para comunicación bidireccional en tiempo real (WebSockets).

## 📁 Estructura Principal

* `src/app.js`: Archivo principal donde se levanta el servidor HTTP, la conexión a MongoDB y el servidor de WebSockets.
* `src/routes/`: Contiene los enrutadores de la API REST (`products` y `carts`) y las rutas visuales (`views`).
* `src/models/`: Contiene los esquemas de Mongoose para la base de datos (`product.model.js` y `cart.model.js`).
* `src/managers/`: Lógica de negocio para interactuar con la base de datos (CRUD completo).
* `src/views/`: Contiene las plantillas de Handlebars (`products`, `productDetail`, `cart` y `realTimeProducts`).
* `src/public/`: Archivos estáticos, como el script del cliente (`realtime.js`) para conectarse a los WebSockets.

## ⚙️ Instalación y Configuración

Sigue estos pasos para correr el proyecto en tu máquina local:

1. **Clonar o descargar el proyecto**
2. **Abrir una terminal** en la carpeta raíz del proyecto.
3. **Instalar las dependencias** necesarias ejecutando el siguiente comando:
   ```bash
   npm install
   ```

## 🚀 Cómo iniciar el servidor

Tienes dos opciones para levantar el servidor (se ejecutará por defecto en el puerto `8080`):

* **Modo Desarrollo (Recomendado):** El servidor se reiniciará automáticamente si detecta cambios en el código.
  ```bash
  npm run dev
  ```
* **Modo Normal:**
  ```bash
  npm start
  ```

## 🌐 Rutas Disponibles (Vistas para el Usuario)

Una vez que el servidor indique `¡Conectado a la base de datos MongoDB!`, puedes abrir tu navegador y visitar las siguientes rutas:

* **Catálogo de Productos Paginado**
  👉 `http://localhost:8080/products`
  Muestra todos los productos disponibles en la base de datos con paginación integrada.

* **Vista en Tiempo Real (WebSockets)**
  👉 `http://localhost:8080/realtimeproducts`
  Formulario reactivo para agregar y eliminar productos. La lista se actualiza automáticamente para todos los clientes conectados usando el ID único de MongoDB.

*(Nota: Desde el catálogo `/products` puedes navegar automáticamente a los Detalles de cada producto y al Carrito de compras).*

## 📡 Endpoints Principales (API REST)

El proyecto cuenta con una API robusta para consumir los datos:
* `GET /api/products`: Devuelve productos con soporte para paginación (`?limit`, `?page`), ordenamiento (`?sort`) y filtros (`?query`).
* `GET /api/carts/:cid`: Devuelve un carrito específico aplicando `populate` para traer la información completa de sus productos internos.
* Cuenta además con todos los métodos `POST`, `PUT` y `DELETE` para administrar el inventario y los carritos.

## 👤 Autor

* **Alejandro Almaguer**