// El código JavaScript que vivirá en tu página web y se comunicará con el servidor a través de WebSockets

// Conectamos con el servidor de sockets
const socket = io();

// Referencias a los elementos del DOM
const productList = document.getElementById('productList');
const addProductForm = document.getElementById('addProductForm');
const deleteProductForm = document.getElementById('deleteProductForm');

// Escuchamos el evento 'updateProducts' que nos manda el servidor
socket.on('updateProducts', (products) => {
    // Limpiamos la lista actual
    productList.innerHTML = '';

    // Recorremos los productos y los agregamos al HTML
    products.forEach(product => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>ID: ${product.id}</strong> - ${product.title} - $${product.price}`;
        productList.appendChild(li);
    });
});

// Evento para AGREGAR producto
addProductForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Evitamos que la página se recargue

    // Capturamos los datos del formulario
    const newProduct = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        price: parseFloat(document.getElementById('price').value),
        code: document.getElementById('code').value,
        stock: parseInt(document.getElementById('stock').value)
    };

    // Enviamos el evento al servidor a través de websockets
    socket.emit('addProduct', newProduct);

    // Limpiamos el formulario
    addProductForm.reset();
});

// Evento para ELIMINAR producto
deleteProductForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Capturamos el ID y lo convertimos a número
    const id = parseInt(document.getElementById('deleteId').value);
    
    // Enviamos el evento de eliminar al servidor
    socket.emit('deleteProduct', id);

    // Limpiamos el formulario
    deleteProductForm.reset();
});