const socket = io();

const productList = document.getElementById('productList');
const addProductForm = document.getElementById('addProductForm');
const deleteProductForm = document.getElementById('deleteProductForm');

socket.on('updateProducts', (products) => {
    productList.innerHTML = '';
    products.forEach(product => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>ID: ${product._id}</strong> - ${product.title} - $${product.price} (${product.category})`;
        productList.appendChild(li);
    });
});

addProductForm.addEventListener('submit', (e) => {
    e.preventDefault(); 

    const newProduct = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        price: parseFloat(document.getElementById('price').value),
        code: document.getElementById('code').value,
        stock: parseInt(document.getElementById('stock').value),
        // ¡AHORA SÍ CAPTURAMOS LA CATEGORÍA DESDE EL FORMULARIO!
        category: document.getElementById('category').value
    };

    socket.emit('addProduct', newProduct);
    addProductForm.reset();
});

deleteProductForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('deleteId').value;
    socket.emit('deleteProduct', id);
    deleteProductForm.reset();
});