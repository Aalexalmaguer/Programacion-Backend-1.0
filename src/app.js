// 1. Importamos las dependencias necesarias para crear nuestro servidor Express y manejar rutas
import express from "express";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";

// Creamos una instancia de Express, esto nos permitirá configurar nuestro servidor y definir rutas
const app = express();
const PORT = 8080;

// Usamos los routers importados para manejar las rutas específicas de productos y carritos, esto nos ayuda a mantener nuestro código organizado y modularizado
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Configuramos las rutas base
// Todo lo que llegue a /api/products se manda al router de productos
app.use('/api/products', productsRouter);

// Todo lo que llegue a /api/carts se manda al router de carritos
app.use('/api/carts', cartsRouter);

app.listen(PORT, () => {
    console.log(`Server escuchando en puerto ${PORT}`);
});