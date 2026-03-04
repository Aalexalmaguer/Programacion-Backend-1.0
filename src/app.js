// Importamos las dependencias necesarias para crear nuestro servidor Express y manejar rutas
import express from "express";
import {engine} from "express-handlebars";
import {Server} from "socket.io";

// Importamos los Routers
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import ProductManager from "./managers/ProductManager.js";

// Configuración para usar dir


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

//Iniciamos el servidor HTTP
const httpServer = app.listen(PORT, () => {
    console.log(`Server escuchando en el puerto ${PORT}`);
});

// Iniciamos el servidor de Websockets adjuntandolo al servidor HTTP
const io = new Server(httpServer);
const manager = new ProductManager('./src/data/products.json');

// Lógica de Websockets
io.on('connection', async (socket) => {
    console.log('Un cliente se ha conectado');

    //1. Cuando un cliente se conecta, le enviamos la lista actual de productos
    const products = await manager.getProducts();
    socket.emit('updateProducts', products);

    //2. Escuchamos cuando el cliente quiere agregar un producto
    socket.on('addProduct', async (product) => { 
        await manager.addProduct(product);
        // Volvemos a leer la lista y la emitimos a TODOS los clientes conectados
        const updatedProducts = await manager.getProducts();
        io.emit('updateProducts', updatedProducts);
    });

    // 3. Escuchamos cuando el cliente quiere eliminar un producto
    socket.on('deleteProduct', async (id) => {
        await manager.deleteProduct(id);
        // Emitimos la lista actualizada a TODOS
        const updatedProducts = await manager.getProducts();
        io.emit('updateProducts', updatedProducts);
    });
});