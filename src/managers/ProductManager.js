import fs from 'fs';

export default class ProductManager {
    constructor(path) {
        this.path = path;
    }

    // 1. Obtener todos los productos
    getProducts = async () => {
        try {
            if (fs.existsSync(this.path)) {
                const data = await fs.promises.readFile(this.path, 'utf-8');
                const products = JSON.parse(data);
                return products;
            } else {
                return []; // Si no existe el archivo, devuelve un array vacío
            }
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    // 2. Agregar un producto
    addProduct = async (product) => {
        try {
            const products = await this.getProducts();

            // Generar ID automático (incrementable)
            let id;
            if (products.length === 0) {
                id = 1;
            } else {
                id = products[products.length - 1].id + 1;
            }

            const newProduct = {
                id,
                ...product
            };

            products.push(newProduct);

            await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
            return newProduct;

        } catch (error) {
            console.log(error);
        }
    }

    // 3. Buscar producto por ID
    getProductById = async (id) => {
        const products = await this.getProducts();
        const product = products.find(prod => prod.id === id);
        return product; // Devuelve el producto o undefined si no lo encuentra
    }

    // 4. Actualizar producto
    updateProduct = async (id, productUpdates) => {
        const products = await this.getProducts();
        const index = products.findIndex(prod => prod.id === id);

        if (index !== -1) {
            // Mantenemos el ID original y sobrescribimos el resto
            products[index] = { ...products[index], ...productUpdates, id }; 
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
            return products[index];
        }
        return null; // Si no lo encuentra
    }

    // 5. Borrar producto
    deleteProduct = async (id) => {
        const products = await this.getProducts();
        const index = products.findIndex(prod => prod.id === id);

        if (index !== -1) {
            const newProducts = products.filter(prod => prod.id !== id);
            await fs.promises.writeFile(this.path, JSON.stringify(newProducts, null, '\t'));
            return true; // Borrado exitoso
        }
        return false; // No encontrado
    }
}