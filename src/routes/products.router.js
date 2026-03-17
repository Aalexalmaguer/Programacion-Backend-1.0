// Importamos el router de Express
import { Router } from 'express';
// Importamos nuestro manager
import ProductManager from '../managers/ProductManager.js';

const router = Router();
// Instanciamos el manager (ahora con los paréntesis vacíos)
const manager = new ProductManager();

// GET /api/products - Obtener todos los productos con paginación y filtros
router.get('/', async (req, res) => {
    try {
        // 1. Capturamos los query params que pidió el profe (con valores por defecto)
        const { limit = 10, page = 1, sort, query } = req.query;

        // 2. Le pedimos al manager que haga la búsqueda en Mongo
        const result = await manager.getProducts(limit, page, sort, query);

        // 3. Preparamos la ruta base para armar los links de "Siguiente" y "Anterior"
        const baseUrl = req.protocol + '://' + req.get('host') + req.baseUrl;
        
        const buildLink = (pageNumber) => {
            let link = `${baseUrl}?limit=${limit}&page=${pageNumber}`;
            if (sort) link += `&sort=${sort}`;
            if (query) link += `&query=${query}`;
            return link;
        };

        // 4. Devolvemos el objeto EXACTAMENTE con el formato que pide la consigna
        res.json({
            status: 'success',
            payload: result.docs, // result.docs es donde Mongoose guarda el arreglo de productos
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? buildLink(result.prevPage) : null,
            nextLink: result.hasNextPage ? buildLink(result.nextPage) : null
        });

    } catch (error) {
        res.status(500).json({ status: 'error', message: "Error al obtener los productos" });
    }
});

// GET /api/products/:pid - Obtener un producto por su ID
router.get('/:pid', async (req, res) => {
    try {
        // ¡OJO AQUÍ! Quitamos el parseInt porque en Mongo los IDs son de tipo String (ObjectId)
        const productId = req.params.pid; 
        const product = await manager.getProductById(productId); 

        if (!product) {
            return res.status(404).send({ error: "Producto no encontrado" }); 
        }
        res.json(product); 
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el producto" }); 
    }
});


// POST /api/products - Agregar un nuevo producto
router.post('/', async (req, res) => {
    try {
        const product = req.body; 

        if (!product.title || !product.price) {
            return res.status(400).send({ error: "Faltan campos obligatorios: title y price" }); 
        }

        const newProduct = await manager.addProduct(product); 
        res.status(201).json(newProduct); 
    } catch (error) {
        res.status(500).json({ error: "Error al agregar el producto" }); 
    }
});

// PUT /api/products/:pid - Actualizar un producto existente
router.put('/:pid', async (req, res) => {
    try {
        const id = req.params.pid; // Quitamos parseInt
        const updateData = req.body; 

        const updatedProduct = await manager.updateProduct(id, updateData); 
        if (!updatedProduct) {
            return res.status(404).send({ error: "Producto no encontrado para actualizar" }); 
        }
        res.send(updatedProduct); 
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el producto" }); 
    }
});

// DELETE /api/products/:pid - Eliminar un producto por su ID
router.delete('/:pid', async (req, res) => {
    try {
        const id = req.params.pid; // Quitamos parseInt

        const success = await manager.deleteProduct(id); 

        if (!success) {
            return res.status(404).send({ error: "Producto no encontrado para eliminar" }); 
        }
        res.json({ message: "Producto eliminado correctamente" }); 
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el producto" }); 
    }
});

export default router;