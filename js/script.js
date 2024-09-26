let cartItems = [];
const cartItemsList = document.getElementById('cart-items-list');
const cartItemCount = document.getElementById('cart-item-count');
const fixedCartCount = document.getElementById('cart-modal-count');

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
    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    cartItemCount.innerText = totalItems;
    fixedCartCount.textContent = totalItems + ' articles';

    if (cartItems.length > 0) {
        $("#validerBtn").fadeIn();
    } else {
        $("#validerBtn").fadeOut();
    }

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
function addToCart(product, quantity) {
    const currentStock = product.stock;

    if (quantity <= currentStock) {
        const existingProductIndex = cartItems.findIndex(item => item.name === product.name);

        if (existingProductIndex === -1) {
            cartItems.push({
                name: product.name,
                image: product.image,
                quantity: quantity
            });
        } else {
            const newQuantity = cartItems[existingProductIndex].quantity + quantity;
            if (newQuantity <= currentStock) {
                cartItems[existingProductIndex].quantity += quantity;
            } else {
                Toastify({
                    text: "Quantité dépassée! Stock restant: " + currentStock,
                    duration: 3000,
                    gravity: "top",
                    position: "center",
                    backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
                    stopOnFocus: true,
                }).showToast();
                return;
            }
        }

        product.stock -= quantity;
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

function generateProductHTML(product) {
    return `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <h3 class="product-title">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-quantity">
                <button class="quantity-btn decrease-btn">-</button>
                <span class="quantity-display">1</span>
                <button class="quantity-btn increase-btn">+</button>
            </div>
            <div class="product-actions">
                <button class="btn btn-primary add-to-cart">Ajouter au panier</button>
                <button class="btn btn-info" data-toggle="tooltip" data-placement="top"
                    title="${product.description}">
                    <i class="fas fa-info-circle"></i>
                </button>
            </div>
        </div>`;
}

$(document).ready(function () {
    const productGrid = $('#productGrid');

    products.forEach(product => {
        productGrid.append(generateProductHTML(product));
    });

    $('[data-toggle="tooltip"]').tooltip();

    productGrid.on('click', '.add-to-cart', function () {
        const productCard = $(this).closest('.product-card');
        const productName = productCard.find('.product-title').text();
        const productQuantity = parseInt(productCard.find('.quantity-display').text(), 10);

        const product = products.find(p => p.name === productName);
        if (product) {
            addToCart(product, productQuantity);
        }
    });

    productGrid.on('click', '.increase-btn', function () {
        const productCard = $(this).closest('.product-card');
        const productName = productCard.find('.product-title').text();
        const product = products.find(p => p.name === productName);
        const quantityDisplay = $(this).closest('.product-quantity').find('.quantity-display');
        let quantity = parseInt(quantityDisplay.text(), 10);

        if (quantity < product.stock) {
            quantity++;
            quantityDisplay.text(quantity);
        } else {
            Toastify({
                text: "Stock limité!",
                duration: 3000,
                gravity: "top",
                position: "center",
                backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
                stopOnFocus: true,
            }).showToast();
        }
    });

    productGrid.on('click', '.decrease-btn', function () {
        const quantityDisplay = $(this).closest('.product-quantity').find('.quantity-display');
        let quantity = parseInt(quantityDisplay.text(), 10);
        if (quantity > 1) {
            quantity--;
            quantityDisplay.text(quantity);
        }
    });
});

// Open the cart modal
document.querySelectorAll('.cart, .cart-icon').forEach(cartElement => {
    cartElement.addEventListener('click', function() {
        document.getElementById('cartModal').classList.add('show');
    });
});

// Close the cart modal
document.getElementById('closeCart').addEventListener('click', function() {
    document.getElementById('cartModal').classList.remove('show');
});

// Handle the datepicker and note sections
$(document).ready(function() {
    $(".datepicker").datepicker({
        dateFormat: "dd/mm/yy",
        minDate: 0
    });

    $("#dateDebut").datepicker("setDate", new Date());
});

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
        cartItems = [];
        updateCart();  // Reset the cart display
        $("#dateDebut").val('');
        $("#dateFin").val('');
        $("#note").val('');

        $("#dateSection, #noteSection, #confirmerBtn").fadeOut(300);

        setTimeout(function () {
            $("#cartModal").removeClass('show');
        }, 500);
    }
});



const products = [
    {name: 'Casque de réalité augmentée', image: 'images/613PQlT9mzL.jpg', stock: 13, description: 'Découvrez une nouvelle dimension de divertissement avec le dernier casque VR.'},
    {name: 'Ordinateur Portable', image: 'images/laptop.png', stock: 7, description: 'Ordinateur performant pour toutes vos tâches.'},
    {name: 'Imprimante 3D', image: 'images/printer3d.png', stock: 5, description: 'Imprimez vos créations avec cette imprimante 3D.'},
    {name: 'Microscope', image: 'images/microscope.png', stock: 8, description: 'Microscope avancé pour analyses scientifiques.'},
    {name: 'Tablette Graphique', image: 'images/graphic-tablet.png', stock: 10, description: 'Tablette pour dessiner et créer avec précision.'},
    {name: 'Projecteur HD', image: 'images/projector.jpg', stock: 6, description: 'Projecteur pour des présentations et divertissements.'},
    {name: 'Caméra de Surveillance', image: 'images/camera.jpg', stock: 12, description: 'Caméra pour une sécurité renforcée.'},
    {name: 'Robot Programmable', image: 'images/robot.jpg', stock: 4, description: 'Apprenez la programmation avec ce robot.'},
    {name: 'Clavier Mécanique', image: 'images/keyboard.jpg', stock: 9, description: 'Clavier pour une frappe rapide et précise.'}
];
