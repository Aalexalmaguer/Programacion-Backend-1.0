import { Router } from 'express';
import CartManager from '../managers/CartManager.js';

const router = Router();
const manager = new CartManager(); // Sin ruta de archivo

// POST /api/carts - Crear un carrito
router.post('/', async (req, res) => {
    try {
        const newCart = await manager.createCart();
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ error: "Error al crear el carrito" });
    }
});

// GET /api/carts/:cid - Ver un carrito (Ya viene con populate desde el manager)
router.get('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await manager.getCartById(cartId);

        if (!cart) return res.status(404).send({ error: "Carrito no encontrado" });
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el carrito" });
    }
});

// POST /api/carts/:cid/product/:pid - Agregar producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;

        const updatedCart = await manager.addProductToCart(cartId, productId);
        if (!updatedCart) return res.status(404).send({ error: "Carrito o Producto no encontrado" });

        res.json(updatedCart);
    } catch (error) {
        res.status(500).json({ error: "Error al agregar el producto al carrito" });
    }
});

// DELETE /api/carts/:cid/products/:pid - Eliminar un producto del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const updatedCart = await manager.deleteProductFromCart(cid, pid);
        if (!updatedCart) return res.status(404).json({ error: "No se pudo eliminar el producto" });

        res.json({ message: "Producto eliminado del carrito", cart: updatedCart });
    } catch (error) {
        res.status(500).json({ error: "Error interno" });
    }
});

// PUT /api/carts/:cid - Actualizar todo el arreglo de productos
router.put('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const products = req.body; // Se espera un arreglo de productos [{product: "id", quantity: 2}]

        const updatedCart = await manager.updateCart(cartId, products);
        if (!updatedCart) return res.status(404).json({ error: "Carrito no encontrado" });

        res.json({ message: "Carrito actualizado", cart: updatedCart });
    } catch (error) {
        res.status(500).json({ error: "Error interno" });
    }
});

// PUT /api/carts/:cid/products/:pid - Actualizar SOLO la cantidad de un producto
router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body; // Se espera { "quantity": 5 }

        const updatedCart = await manager.updateProductQuantity(cid, pid, quantity);
        if (!updatedCart) return res.status(404).json({ error: "No se pudo actualizar" });

        res.json({ message: "Cantidad actualizada", cart: updatedCart });
    } catch (error) {
        res.status(500).json({ error: "Error interno" });
    }
});

// DELETE /api/carts/:cid - Vaciar todo el carrito
router.delete('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const emptyCart = await manager.emptyCart(cartId);
        if (!emptyCart) return res.status(404).json({ error: "Carrito no encontrado" });

        res.json({ message: "Carrito vaciado", cart: emptyCart });
    } catch (error) {
        res.status(500).json({ error: "Error interno" });
    }
});

export default router;