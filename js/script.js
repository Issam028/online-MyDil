let quantity = 1;
const quantityDisplay = document.getElementById('quantity');
const increaseBtn = document.getElementById('increase');
const decreaseBtn = document.getElementById('decrease');
const fixedCartCount = document.getElementById('cart-modal-count');
let cartItems = [];
const cartItemsList = document.getElementById('cart-items-list');
const cartItemCount = document.getElementById('cart-item-count');

let productStock = {
    'Casque de réalité augmentée': {
        name: 'Casque de réalité augmentée',
        image: 'images/613PQlT9mzL.jpg',
        stock: 13
    }
};

// Update quantity display
quantityDisplay.textContent = quantity;

// Increase quantity
increaseBtn.addEventListener('click', function() {
    if (quantity < productStock['Casque de réalité augmentée'].stock) {
        quantity++;
        quantityDisplay.textContent = quantity;
    } else {
        Toastify({
            text: "Stock insuffisant!",
            duration: 3000,
            gravity: "top",
            position: "center",
            backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
            stopOnFocus: true,
        }).showToast();
    }
});

// Decrease quantity
decreaseBtn.addEventListener('click', function() {
    if (quantity > 1) {
        quantity--;
        quantityDisplay.textContent = quantity;
    }
});

// Update the cart display
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

    cartItemsList.innerHTML = cartHtml || "<li>Aucun article dans le panier.</li>";
    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0); // Calculate total quantity of items
    cartItemCount.innerText = totalItems; // Update the navbar cart count
    fixedCartCount.textContent = totalItems + ' articles';
    // Handle showing or hiding the "Valider" button
    if (cartItems.length > 0) {
        $("#validerBtn").fadeIn();
    } else {
        $("#validerBtn").fadeOut();
    }

    // Add delete functionality
    document.querySelectorAll('.delete-item').forEach(button => {
        button.addEventListener('click', function() {
            const itemIndex = this.getAttribute('data-index');
            removeFromCart(itemIndex);
        });
    });
}

// Remove item from cart
function removeFromCart(index) {
    let removedItem = cartItems[index];
    productStock[removedItem.name].stock += removedItem.quantity;
    cartItems.splice(index, 1);
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

// Add item to cart
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
            cartItems[existingProductIndex].quantity += quantity; // Add to existing quantity
        }

        productStock[product.name].stock -= quantity;
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
            text: "Stock insuffisant!",
            duration: 3000,
            gravity: "top",
            position: "center",
            backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
            stopOnFocus: true,
        }).showToast();
    }
}

// Attach event listener to the add to cart button
document.querySelector('.btn-primary').addEventListener('click', function() {
    const product = productStock['Casque de réalité augmentée'];
    addToCart(product);
});

// Apply functionality to both carts (navbar and fixed)
document.querySelectorAll('.cart, .cart-icon').forEach(cartElement => {
    cartElement.addEventListener('click', function() {
        document.getElementById('cartModal').classList.add('show');
    });
});

document.getElementById('closeCart').addEventListener('click', function() {
    document.getElementById('cartModal').classList.remove('show');
});

// Handle the datepicker and note sections
$(document).ready(function() {
    $(".datepicker").datepicker({
        dateFormat: "dd/mm/yy",
        minDate: 0
    });

    $("#dateDebut").datepicker("setDate", new Date()); // Default to today's date
});

// Valider and Confirmer button logic
$("#validerBtn").on("click", function () {
    $("#validerBtn").fadeOut(300);
    $("#dateSection, #noteSection, #confirmerBtn").fadeIn(400).css("display", "block");

    Toastify({
        text: "Veuillez sélectionner une date de début, une date de fin, et la raison.",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "linear-gradient(to right, #FF7E03, #FFA533)"
    }).showToast();
});

$("#confirmerBtn").on("click", function () {
    let dateDebut = $("#dateDebut").val();
    let dateFin = $("#dateFin").val();
    let note = $("#note").val();

    if (!dateFin) {
        Toastify({
            text: "Veuillez sélectionner une date de fin.",
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: "linear-gradient(to right, #FF5F6D, #FFC371)"
        }).showToast();
    } else if (!note) {
        Toastify({
            text: "Veuillez entrer une raison.",
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: "linear-gradient(to right, #FF5F6D, #FFC371)"
        }).showToast();
    } else {
        Toastify({
            text: "Votre demande a été envoyée.",
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)"
        }).showToast();

        // Clear the cart and reset the form
        $("#cart-items-list").html("<li>Aucun article dans le panier.</li>");
        $("#dateDebut").val(''); // Reset the date inputs
        $("#dateFin").val('');
        $("#note").val(''); // Reset the note field

        // Hide the date and note sections
        $("#dateSection, #noteSection, #confirmerBtn").fadeOut(300);

        // Optionally hide the cart modal after confirmation
        setTimeout(function () {
            $("#cartModal").removeClass('show');
        }, 500);

        console.log("Date début: " + dateDebut);
        console.log("Date fin: " + dateFin);
        console.log("Raison: " + note);
    }
});

