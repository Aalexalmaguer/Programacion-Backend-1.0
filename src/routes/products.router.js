// Importamos el router de Express
import {Router} from 'express';

// Importamos el ProductManager para poder usarlo en nuestras rutas de productos
import ProductManager from '../managers/ProductManager.js';

// Creamos una instancia del router, esto nos permitirá definir rutas específicas para productos
const router = Router();

// Creamos una instancia del ProductManager, esto nos permitirá manejar los productos almacenados en el archivo JSON
const manager = new ProductManager('./src/data/products.json');

// Creamos una ruta GET para obtener todos los productos, esta ruta responderá a las solicitudes GET en la raíz del router (es decir, /api/products)
router.get('/', async (req, res) => {
    try {
        //Le pedimos al manager que nos devuelva los productos, esto se hace de manera asíncrona porque el manager lee los productos desde un archivo
        const products = await manager.getProducts();

        //Enviamos la lista como respuesta, esto convertirá el array de productos en formato JSON y lo enviará al cliente
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los productos" });
    }
});

// GET /api/products/:pid - Obtener un producto por su ID
router.get('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid); // Obtenemos el ID del producto desde los parámetros de la URL y lo convertimos a entero
        const product = await manager.getProductById(productId); // Le pedimos al manager que nos devuelva el producto con el ID especificado

        if (!product) {
            return res.status(404).send({ error: "Producto no encontrado" }); // Si el producto no existe, respondemos con un error 404
        }

        res.json(product); // Si el producto existe, lo enviamos como respuesta en formato JSON
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el producto" }); // Si ocurre un error al obtener el producto, respondemos con un error 500
    }
});


// POST /api/products - Agregar un nuevo producto
router.post('/', async (req, res) => {
    try {
        const product = req.body; // Obtenemos los datos del nuevo producto desde el cuerpo de la solicitud

        // Validamos que se hayan proporcionado todos los campos necesarios para crear un producto
        if (!product.title || !product.price) {
            return res.status(400).send({ error: "Faltan campos obligatorios: title y price" }); // Si faltan campos obligatorios, respondemos con un error 400
        }

        const newProduct = await manager.addProduct(product); // Le pedimos al manager que agregue el nuevo producto, esto se hace de manera asíncrona porque el manager escribe el producto en un archivo
        res.status(201).json(newProduct); // Respondemos con el nuevo producto creado en formato JSON y un status 201 (creado)
    } catch (error) {
        res.status(500).json({ error: "Error al agregar el producto" }); // Si ocurre un error al agregar el producto, respondemos con un error 500
    }
});

// PUT /api/products/:pid - Actualizar un producto existente
router.put('/:pid', async (req, res) => {
    try {
        const id = parseInt(req.params.pid); // Obtenemos el ID del producto desde los parámetros de la URL y lo convertimos a entero
        const updateData = req.body; // Obtenemos los datos de actualización desde el cuerpo de la solicitud

        const updatedProduct = await manager.updateProduct(id, updateData); // Le pedimos al manager que actualice el producto con el ID especificado, esto se hace de manera asíncrona porque el manager escribe el producto actualizado en un archivo
        if (!updatedProduct) {
            return res.status(404).send({ error: "Producto no encontrado para actualizar" }); // Si el producto no existe, respondemos con un error 404
        }

        res.send(updatedProduct); // Si el producto se actualizó correctamente, lo enviamos como respuesta
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el producto" }); // Si ocurre un error al actualizar el producto, respondemos con un error 500
    }
});

// DELETE /api/products/:pid - Eliminar un producto por su ID
router.delete('/:pid', async (req, res) => {
    try {
        const pid = parseInt(req.params.pid); // Obtenemos el ID del producto desde los parámetros de la URL y lo convertimos a entero

        const success = await manager.deleteProduct(pid); // Le pedimos al manager que elimine el producto con el ID especificado, esto se hace de manera asíncrona porque el manager escribe los cambios en un archivo

        if (!success) {
            return res.status(404).send({ error: "Producto no encontrado para eliminar" }); // Si el producto no existe, respondemos con un error 404
        }
        res.json({ message: "Producto eliminado correctamente" }); // Si el producto se eliminó correctamente, respondemos con un mensaje de éxito
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el producto" }); // Si ocurre un error al eliminar el producto, respondemos con un error 500
    }
});


// Exportamos el router para usarlo en app.js, esto nos permite mantener nuestro código organizado y modularizado
export default router;