import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";
import CartManager from "../managers/CartManager.js";

const router = Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

// 1. Vista de TODOS los productos (con paginación)
router.get('/products', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;
        const result = await productManager.getProducts(limit, page, sort, query);

        res.render('products', {
            products: result.docs,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page
        });
    } catch (error) {
        res.status(500).send("Error interno del servidor");
    }
});

// 2. Vista de los DETALLES de un solo producto
router.get('/products/:pid', async (req, res) => {
    try {
        const product = await productManager.getProductById(req.params.pid);
        if (!product) return res.status(404).send("Producto no encontrado");
        
        res.render('productDetail', { product });
    } catch (error) {
        res.status(500).send("Error interno del servidor");
    }
});

// 3. Vista del CARRITO específico
router.get('/carts/:cid', async (req, res) => {
    try {
        const cart = await cartManager.getCartById(req.params.cid);
        if (!cart) return res.status(404).send("Carrito no encontrado");
        
        res.render('cart', { cart });
    } catch (error) {
        res.status(500).send("Error interno del servidor");
    }
});

// Mantenemos tu vista en tiempo real intacta
router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts');
});

export default router;