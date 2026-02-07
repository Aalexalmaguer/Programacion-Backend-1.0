// Importamos el router de Express
import {Router} from 'express';

// Importamos el CartManager para poder usarlo en nuestras rutas de carritos
import CartManager from '../managers/CartManager.js';

// Creamos una instancia del router, esto nos permitirá definir rutas específicas para productos
const router = Router();

// Creamos una instancia del CartManager, esto nos permitirá manejar los carritos almacenados en el archivo JSON
const manager = new CartManager('./src/data/carts.json');

// 1. Crear un carrito nuevo (POST /api/carts)
router.post('/', async (req, res) => {
    try {
        const newCart = await manager.createCart(); // Le pedimos al manager que cree un nuevo carrito, esto se hace de manera asíncrona porque el manager escribe el carrito en un archivo
        res.status(201).json(newCart); // Respondemos con el nuevo carrito creado en formato JSON y un status 201 (creado)
    } catch (error) {
        res.status(500).json({ error: "Error al crear el carrito" }); // Si ocurre un error al crear el carrito, respondemos con un error 500
    }
});

// 2. Listar productos de un carrito (GET /api/carts/:cid)
router.get('/:cid', async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid); // Obtenemos el ID del carrito desde los parámetros de la URL y lo convertimos a entero
        const cart = await manager.getCartById(cartId); //

        if (!cart) {
            return res.status(404).send({ error: "Carrito no encontrado" }); // Si el carrito no existe, respondemos con un error 404
        }

        // Solo devolvemos el array de productos del carrito, no toda la información del carrito
        res.json(cart.products); // Si el carrito existe, enviamos su array de productos como respuesta en formato JSON
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el carrito" }); // Si ocurre un error al obtener el carrito, respondemos con un error 500
    }
});

// 3. Agregar un producto al carrito (POST /api/carts/:cid/product/:pid)
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid); // Obtenemos el ID del carrito desde los parámetros de la URL y lo convertimos a entero
        const productId = parseInt(req.params.pid); // Obtenemos el ID del producto desde los parámetros de la URL y lo convertimos a entero

        const updatedCart = await manager.addProductToCart(cartId, productId); // Le pedimos al manager que agregue el producto al carrito, esto se hace de manera asíncrona porque el manager escribe los cambios en un archivo

        if (!updatedCart) {
            return res.status(404).send({ error: "Carrito no encontrado" }); // Si el carrito no existe, respondemos con un error 404
        }

        res.json(updatedCart); // Si el producto se agregó correctamente, respondemos con el carrito actualizado en formato JSON
    } catch (error) {
        res.status(500).json({ error: "Error al agregar el producto al carrito" }); // Si ocurre un error al agregar el producto al carrito, respondemos con un error 500
    }
});

// Exportamos el router para usarlo en app.js, esto nos permite mantener nuestro código organizado y modularizado
export default router;