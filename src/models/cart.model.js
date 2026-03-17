import mongoose from 'mongoose';

const cartCollection = 'carts';

const cartSchema = new mongoose.Schema({
    // Un carrito tiene un arreglo de productos
    products: {
        type: [
            {
                // Este 'product' solo guardará un ID...
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'products' // ... pero hace referencia a la colección de productos. ¡Esto permite el "populate"!
                },
                quantity: {
                    type: Number,
                    default: 1
                }
            }
        ],
        default: [] // Empieza vacío
    }
});

export const cartModel = mongoose.model(cartCollection, cartSchema);