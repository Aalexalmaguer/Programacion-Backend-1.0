# 🚀 Proyecto Backend - Tienda con WebSockets y Handlebars

Este es un proyecto de backend desarrollado en Node.js utilizando Express. Implementa un motor de plantillas (Handlebars) para la visualización del frontend y WebSockets (Socket.io) para manejar la actualización de productos en tiempo real sin necesidad de recargar la página.

## 🛠️ Tecnologías Utilizadas

* **Node.js**: Entorno de ejecución para JavaScript.
* **Express.js**: Framework para el servidor HTTP y manejo de rutas.
* **Handlebars**: Motor de plantillas para renderizar HTML dinámico.
* **Socket.io**: Librería para comunicación bidireccional en tiempo real (WebSockets).
* **File System (fs)**: Persistencia de datos en archivos `.json`.

## 📁 Estructura Principal

* `src/app.js`: Archivo principal donde se levanta el servidor HTTP y el servidor de WebSockets.
* `src/routes/`: Contiene los enrutadores de la API (productos y carritos) y de las vistas.
* `src/managers/`: Contiene la lógica para leer, agregar y eliminar datos de los archivos JSON.
* `src/views/`: Contiene las plantillas de Handlebars (`home` y `realTimeProducts`).
* `src/public/`: Archivos estáticos, como el script del cliente para conectarse a los WebSockets.

## ⚙️ Instalación y Configuración

Sigue estos pasos para correr el proyecto en tu máquina local:

1. **Clonar o descargar el proyecto**
2. **Abrir una terminal** en la carpeta raíz del proyecto.
3. **Instalar las dependencias** necesarias ejecutando el siguiente comando:
   ```bash
   npm install
   ```

## 🚀 Cómo iniciar el servidor

Tienes dos opciones para levantar el servidor (se ejecutará en el puerto `8080`):

* **Modo Desarrollo (Recomendado):** El servidor se reiniciará automáticamente si detecta cambios en el código.
  ```bash
  npm run dev
  ```
* **Modo Normal:**
  ```bash
  npm start
  ```

## 🌐 Rutas Disponibles (Vistas)

Una vez que el servidor indique `Server escuchando en puerto 8080`, puedes abrir tu navegador y visitar las siguientes rutas:

* **Página Principal (Estática)**
  👉 `http://localhost:8080/`
  Muestra una lista estática de todos los productos creados, renderizada directamente desde el servidor usando Handlebars.

* **Página en Tiempo Real (WebSockets)**
  👉 `http://localhost:8080/realtimeproducts`
  Contiene un formulario para agregar y eliminar productos. Al realizar una acción, la lista de productos se actualizará automáticamente para todos los clientes conectados, sin necesidad de recargar la página.

## 👤 Autor

* **Alejandro Almaguer**
