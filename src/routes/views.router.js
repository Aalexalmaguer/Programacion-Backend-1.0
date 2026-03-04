// Este archivo nos permite manejar las rutas que devuelven HTML (en lugar de JSON)
import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router()
const manager = new ProductManager('./src/data/products.json');

// Ruta principal: renderiza home.handlebars
router.get('/', async (req, res) => {
    const products = await manager.getProducts();
    res.render('home', {products}); // Le pasamos la lista de productos a la vista
});

// Ruta en tiempo real: renderiza realTimeProducts.handlebars
router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts');
});

export default router;
