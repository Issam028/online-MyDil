let quantity = 1;
const quantityDisplay = document.getElementById('quantity');
const increaseBtn = document.getElementById('increase');
const decreaseBtn = document.getElementById('decrease');
const fixedCartCount = document.getElementById('cart-modal-count');

let productStock = {
    'Casque de réalité augmentée': {
        name: 'Casque de réalité augmentée',
        image: 'images/613PQlT9mzL.jpg',
        stock: 13
    }
};

quantityDisplay.textContent = quantity;

increaseBtn.addEventListener('click', function() {
    if (quantity < productStock['Casque de réalité augmentée'].stock) {
        quantity++;
        quantityDisplay.textContent = quantity;
    } else {
        Toastify({
            text: "Stock insuffisant! Quantité restante: " + currentStock,
            duration: 3000,
            gravity: "top",
            position: "center",
            backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)", // Custom gradient color for error
            stopOnFocus: true,
        }).showToast();
    }
});

decreaseBtn.addEventListener('click', function() {
    if (quantity > 1) {
        quantity--;
        quantityDisplay.textContent = quantity;
    }
});

$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();
});

let cartItems = [];
let uniqueAddCount = 0;
const cartItemsList = document.getElementById('cart-items-list');
const cartItemCount = document.getElementById('cart-item-count');

function updateCart() {
    let cartHtml = '';
    
    cartItems.forEach((item, index) => {
        cartHtml += `
            <li class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-info">
                    <p>${item.name}</p>
                    <p>Quantité: ${item.quantity}</p>
                </div>
                <button class="delete-item" data-index="${index}"><i class="fas fa-trash"></i></button>
            </li>
        `;
    });
    cartItemsList.innerHTML = cartHtml;

    cartItemCount.innerText = uniqueAddCount;
    fixedCartCount.textContent = uniqueAddCount + ' articles';

    document.querySelectorAll('.delete-item').forEach(button => {
        button.addEventListener('click', function() {
            const itemIndex = this.getAttribute('data-index');
            removeFromCart(itemIndex);
        });
    });
}

function removeFromCart(index) {
    let removedItem = cartItems[index];
    productStock[removedItem.name].stock += removedItem.quantity;

    cartItems.splice(index, 1);
    uniqueAddCount--;
    updateCart();

    Toastify({
        text: "Supprimé avec succès",
        duration: 3000,
        gravity: "top",
        position: "center",
        backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
        stopOnFocus: true
    }).showToast();
}

function addToCart(product) {
    const currentStock = productStock[product.name].stock;

    if (quantity <= currentStock) {
        const existingProductIndex = cartItems.findIndex(item => item.name === product.name);

        if (existingProductIndex === -1) {
            cartItems.push({
                name: product.name,
                image: product.image,
                quantity: quantity
            });
        } else {
            cartItems[existingProductIndex].quantity += quantity;
        }

        productStock[product.name].stock -= quantity;
        uniqueAddCount++;
        updateCart();

        Toastify({
            text: "Ajouté avec succès",
            duration: 3000,
            gravity: "top",
            position: "center",
            backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
            stopOnFocus: true,
        }).showToast();
    } else {
        Toastify({
            text: "Stock insuffisant! Quantité restante: " + currentStock,
            duration: 3000,
            gravity: "top",
            position: "center",
            backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
            stopOnFocus: true,
        }).showToast();
    }
}


document.querySelector('.btn-primary').addEventListener('click', function() {
    const product = productStock['Casque de réalité augmentée'];
    addToCart(product);
});

document.getElementById('cart').addEventListener('click', function() {
    document.getElementById('cartModal').classList.add('show');
});

document.getElementById('closeCart').addEventListener('click', function() {
    document.getElementById('cartModal').classList.remove('show');
});
