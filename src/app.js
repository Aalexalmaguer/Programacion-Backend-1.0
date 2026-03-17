// Importamos las dependencias necesarias para crear nuestro servidor Express y manejar rutas
import express from "express";
import {engine} from "express-handlebars";
import {Server} from "socket.io";
import mongoose from "mongoose";

// Importamos los Routers
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import ProductManager from "./managers/ProductManager.js";

// Creamos una instancia de Express, esto nos permitirá configurar nuestro servidor y definir rutas
const app = express();
const PORT = 8080;

// Configuración de Middlewares
// Usamos los routers importados para manejar las rutas específicas de productos y carritos, esto nos ayuda a mantener nuestro código organizado y modularizado
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Carpeta Public para archivos estáticos (como el JS del Cliente)
app.use(express.static('./src/public'));

// Creación de Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

// Configuración de Rutas HTTP
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter); //Ruta para las vistas HTML

// Conexión a MongoDB
const MONGO_URL = "mongodb+srv://alejandroalmaguer2001_db_user:Io54x2NjBe8FtC0A@cluster0.j7txkjq.mongodb.net/tienda?retryWrites=true&w=majority";

mongoose.connect(MONGO_URL)
    .then(() => console.log("¡Conectado a la base de datos MongoDB!"))
    .catch((error) => console.log("Error al conectar con MongoDB:", error));

// 1. PRIMERO iniciamos el servidor HTTP
const httpServer = app.listen(PORT, () => {
    console.log(`Server escuchando en el puerto ${PORT}`);
});

// 2. DESPUÉS iniciamos el servidor de Websockets adjuntándolo al servidor HTTP
const io = new Server(httpServer);
const manager = new ProductManager();

// Lógica de Websockets
io.on('connection', async (socket) => {
    console.log('Un cliente se ha conectado');

    // 1. Enviamos la lista actual (sacándola de .docs)
    const result = await manager.getProducts(100); // Límite de 100 para la vista en tiempo real
    socket.emit('updateProducts', result.docs);

    // 2. Escuchamos cuando el cliente quiere agregar un producto
    socket.on('addProduct', async (product) => { 
        await manager.addProduct(product);
        // Volvemos a leer y emitimos
        const updatedResult = await manager.getProducts(100);
        io.emit('updateProducts', updatedResult.docs);
    });

    // 3. Escuchamos cuando el cliente quiere eliminar un producto
    socket.on('deleteProduct', async (id) => {
        await manager.deleteProduct(id);
        // Volvemos a leer y emitimos
        const updatedResult = await manager.getProducts(100);
        io.emit('updateProducts', updatedResult.docs);
    });
});