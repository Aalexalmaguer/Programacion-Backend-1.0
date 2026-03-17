import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

// Definimos en qué "colección" (como si fuera una tabla) se guardarán
const productCollection = 'products';

// Creamos el "molde" de cómo debe ser un producto
const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: String, required: true, unique: true }, // unique para que no se repita
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    thumbnails: { type: Array, default: [] },
    status: { type: Boolean, default: true } // Para la disponibilidad
});

// Le inyectamos el plugin de paginación a nuestro molde
productSchema.plugin(mongoosePaginate);

// Exportamos el modelo listo para usarse
export const productModel = mongoose.model(productCollection, productSchema);