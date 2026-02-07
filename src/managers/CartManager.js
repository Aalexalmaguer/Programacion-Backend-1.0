import fs from 'fs';

export default class CartManager {
    constructor(path) {
        this.path = path;
    }

    // 1. Obtener todos los carritos (uso interno para leer el archivo)
    getCarts = async () => {
        try {
            if (fs.existsSync(this.path)) {
                const data = await fs.promises.readFile(this.path, 'utf-8');
                return JSON.parse(data);
            }
            return [];
        } catch (error) {
            return [];
        }
    }

    // 2. Crear un carrito nuevo (POST /)
    createCart = async () => {
        const carts = await this.getCarts();

        // Generar ID autoincrementable
        let id;
        if (carts.length === 0) {
            id = 1;
        } else {
            id = carts[carts.length - 1].id + 1;
        }

        // El carrito nace vacío, solo con su ID y un array de products vacío
        const newCart = {
            id,
            products: [] 
        };

        carts.push(newCart);
        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));
        return newCart;
    }

    // 3. Obtener un carrito por ID (GET /:cid)
    getCartById = async (id) => {
        const carts = await this.getCarts();
        return carts.find(cart => cart.id === id);
    }

    // 4. Agregar un producto al carrito (POST /:cid/product/:pid)
    addProductToCart = async (cartId, productId) => {
        const carts = await this.getCarts();
        const cartIndex = carts.findIndex(cart => cart.id === cartId);

        if (cartIndex !== -1) {
            // Ya encontramos el carrito, ahora buscamos si el producto ya existe DENTRO del carrito
            const productIndex = carts[cartIndex].products.findIndex(p => p.product === productId);

            if (productIndex !== -1) {
                // Si ya existe, le sumamos 1 a la cantidad
                carts[cartIndex].products[productIndex].quantity++;
            } else {
                // Si no existe, lo agregamos con cantidad 1
                carts[cartIndex].products.push({
                    product: productId,
                    quantity: 1
                });
            }

            // Guardamos los cambios en el archivo
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));
            return carts[cartIndex];
        }
        return null; // Si no encontró el carrito
    }
}