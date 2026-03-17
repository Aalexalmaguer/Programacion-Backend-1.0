// Importamos el molde de productos que creamos para MongoDB
import { productModel } from '../models/product.model.js';

export default class ProductManager {
    // Ya no necesitamos el constructor del 'path' porque usamos la base de datos directamente

    // 1. Obtener todos los productos (AHORA CON PAGINACIÓN Y FILTROS)
    getProducts = async (limit = 10, page = 1, sort, query) => {
        try {
            // Preparamos el filtro (si el usuario busca por categoría o disponibilidad)
            let filter = {};
            if (query) {
                if (query === 'true' || query === 'false') {
                    filter.status = query === 'true'; // Filtro por disponibilidad
                } else {
                    filter.category = query; // Filtro por categoría
                }
            }

            // Preparamos las opciones de paginación y ordenamiento
            const options = {
                limit: parseInt(limit),
                page: parseInt(page),
                lean: true // lean: true es una configuración MÁGICA para que Handlebars pueda leer los datos de Mongo
            };

            // Si nos piden ordenar por precio
            if (sort === 'asc') {
                options.sort = { price: 1 }; // Ascendente (menor a mayor)
            } else if (sort === 'desc') {
                options.sort = { price: -1 }; // Descendente (mayor a menor)
            }

            // Ejecutamos la búsqueda con la herramienta de paginación
            const result = await productModel.paginate(filter, options);
            return result; 
        } catch (error) {
            console.log("Error en getProducts:", error);
            return null;
        }
    }

    // 2. Agregar un producto
    addProduct = async (product) => {
        try {
            // MongoDB crea el ID automáticamente, así que solo le pasamos el producto
            const newProduct = await productModel.create(product);
            return newProduct;
        } catch (error) {
            console.log("Error al agregar producto:", error);
            return null;
        }
    }

    // 3. Buscar producto por ID
    getProductById = async (id) => {
        try {
            // En Mongo los IDs son un texto alfanumérico largo, no un número simple
            const product = await productModel.findById(id).lean();
            return product;
        } catch (error) {
            console.log("Error al buscar producto por ID:", error);
            return null;
        }
    }

    // 4. Actualizar producto
    updateProduct = async (id, productUpdates) => {
        try {
            // Buscamos por ID y actualizamos en un solo paso
            const updatedProduct = await productModel.findByIdAndUpdate(id, productUpdates, { new: true });
            return updatedProduct;
        } catch (error) {
            console.log("Error al actualizar producto:", error);
            return null;
        }
    }

    // 5. Borrar producto
    deleteProduct = async (id) => {
        try {
            const deletedProduct = await productModel.findByIdAndDelete(id);
            return deletedProduct ? true : false;
        } catch (error) {
            console.log("Error al borrar producto:", error);
            return false;
        }
    }
}