// Importamos el modelo de Mongoose
import { cartModel } from '../models/cart.model.js';

export default class CartManager {

    // 1. Obtener todos los carritos
    getCarts = async () => {
        try {
            return await cartModel.find().lean();
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    // 2. Crear un carrito nuevo
    createCart = async () => {
        try {
            // Se crea vacío por defecto según nuestro modelo
            return await cartModel.create({ products: [] });
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    // 3. Obtener un carrito por ID (¡CON POPULATE!)
    getCartById = async (id) => {
        try {
            // .populate() hace la magia de traer los datos completos del producto, no solo el ID
            return await cartModel.findById(id).populate('products.product').lean();
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    // 4. Agregar producto al carrito
    addProductToCart = async (cartId, productId) => {
        try {
            const cart = await cartModel.findById(cartId);
            if (!cart) return null;

            // Buscamos si el producto ya existe adentro del array
            const productIndex = cart.products.findIndex(p => p.product.toString() === productId);

            if (productIndex !== -1) {
                cart.products[productIndex].quantity++; // Si existe, sumamos 1
            } else {
                cart.products.push({ product: productId, quantity: 1 }); // Si no existe, lo agregamos
            }

            await cart.save(); // Guardamos los cambios en Mongo
            return cart;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    // 5. Eliminar un producto específico del carrito
    deleteProductFromCart = async (cartId, productId) => {
        try {
            const cart = await cartModel.findById(cartId);
            if (!cart) return null;

            // Filtramos para dejar todos los productos EXCEPTO el que queremos borrar
            cart.products = cart.products.filter(p => p.product.toString() !== productId);
            await cart.save();
            return cart;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    // 6. Actualizar TODO el carrito con un arreglo de productos
    updateCart = async (cartId, productsArray) => {
        try {
            return await cartModel.findByIdAndUpdate(cartId, { products: productsArray }, { new: true });
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    // 7. Actualizar SOLO la cantidad de un producto
    updateProductQuantity = async (cartId, productId, quantity) => {
        try {
            const cart = await cartModel.findById(cartId);
            if (!cart) return null;

            const productIndex = cart.products.findIndex(p => p.product.toString() === productId);
            if (productIndex !== -1) {
                cart.products[productIndex].quantity = quantity;
                await cart.save();
                return cart;
            }
            return null;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    // 8. Vaciar el carrito por completo
    emptyCart = async (cartId) => {
        try {
            return await cartModel.findByIdAndUpdate(cartId, { products: [] }, { new: true });
        } catch (error) {
            console.log(error);
            return null;
        }
    }
}