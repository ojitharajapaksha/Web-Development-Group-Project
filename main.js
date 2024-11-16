// Open and close the cart
let cartIcon = document.querySelector("#cart-icon");
let cart = document.querySelector(".cart");
let closeCart = document.querySelector("#close-cart");
let cartContent = document.querySelector(".cart-content");
let submitButton=document.querySelector("#btnSubmit");
let payButton=document.querySelector("#payButton");

// Open cart
cartIcon.onclick = () => {
    cart.classList.add("cart-active");
};

// Close cart
closeCart.onclick = () => {
    cart.classList.remove("cart-active");
};

submitButton.onclick=()=>{
    cart.classList.remove("cart-active");
    document.getElementById("products").style.display="none";
    document.getElementById("navHeader").style.display="none";
    document.getElementById("payment").style.display="flex";
};

payButton.onclick=()=>{
    document.getElementById("payment").style.display="none";
    document.getElementById("success").style.display="flex";
    countdown();
};

function countdown() {
    var count = 3; 
    var redirectBtn = document.getElementById("redirectBtn");
    
    var countdownInterval = setInterval(function() {
        count--;
        if (count <= 0) {
            clearInterval(countdownInterval);
            window.location.href = "#"; 
        } else {
            redirectBtn.innerHTML = "Redirecting in " + count + " seconds...";
        }
    }, 1000); 
}

// Making add to cart
if (document.readyState == "loading") {
    document.addEventListener("DOMContentLoaded", ready);
} else {
    ready();
}

// Making function
function ready() {
    // Remove item from cart
    var removeCartButtons = document.querySelectorAll(".cart-remove");
    for (var i = 0; i < removeCartButtons.length; i++) {
        var button = removeCartButtons[i];
        button.addEventListener("click", removeCartItem);
    }
    // Quantity change
    var quantityInputs = document.querySelectorAll(".cart-quantity");
    for (var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i];
        input.addEventListener("change", quantityChange);
    }
    // Add to Cart
    var addCartButtons = document.querySelectorAll(".add-cart");
    for (var i = 0; i < addCartButtons.length; i++) {
        var button = addCartButtons[i];
        button.addEventListener("click", addCartClicked);
    }
}

// Remove cart item
function removeCartItem(event) {
    var buttonClicked = event.target;
    var cartBox = buttonClicked.parentElement;
    cartBox.remove();
    updatetotal();
    saveCartItems();
    updateCartIcon();
}

// Quantity change
function quantityChange(event) {
    var input = event.target;
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }
    updatetotal();
    saveCartItems();
    updateCartIcon();
}

// Add cart function
function addCartClicked(event) {
    var button = event.target;
    var shopProduct = button.parentElement;
    var title = shopProduct.querySelector(".product-title").innerText;
    var price = shopProduct.querySelector(".price").innerText;
    var productImg = shopProduct.querySelector(".product-img").src;
    addProductToCart(title, price, productImg);
    updatetotal();
    saveCartItems();
    updateCartIcon();
}

function addProductToCart(title, price, productImg) {
    var cartShopBox = document.createElement("div");
    cartShopBox.classList.add("cart-box");
    var cartItems = document.querySelector(".cart-content");
    var cartItemsNames = cartItems.getElementsByClassName("cart-product-title");
    for (var i = 0; i < cartItemsNames.length; i++) {
        if (cartItemsNames[i].innerText == title) {
            alert("You have already added this item to cart");
            return;
        }
    }
    var cartBoxContent = `
        <img src="${productImg}" alt="" class="cart-img"/>
        <div class="detail-box">
            <div class="cart-product-title">${title}</div>
            <div class="cart-price">${price}</div>
            <input type="number" name="" value="1" class="cart-quantity"/>
        </div>    
        <!-- Remove Item -->
        <i class="bx bx-trash-alt cart-remove"></i>`;

    cartShopBox.innerHTML = cartBoxContent;
    cartItems.append(cartShopBox);
    cartShopBox.querySelector('.cart-remove').addEventListener('click', removeCartItem);
    cartShopBox.querySelector('.cart-quantity').addEventListener('change', quantityChange);
}

// Update total
function updatetotal() {
    var cartBoxes = document.querySelectorAll(".cart-box");
    var total = 0;
    for (var i = 0; i < cartBoxes.length; i++) {
        var cartBox = cartBoxes[i];
        var parentElement = cartBox.querySelector(".cart-price");
        var quantityElement = cartBox.querySelector(".cart-quantity");
        var price = parseFloat(parentElement.innerText.replace("Rs.", ""));
        var quantity = quantityElement.value;
        total += price * quantity;
    }
    document.querySelector(".total-price").innerText = 'Rs.' + total;
}

// Keep item in cart when page refresh with local storage
function saveCartItems(){
    var cartBoxes = document.querySelectorAll('.cart-box');
    var cartItems = [];

    for(var i=0; i<cartBoxes.length; i++){
        var cartBox = cartBoxes[i];
        var titleElement = cartBox.querySelector('.cart-product-title');
        var priceElement = cartBox.querySelector('.cart-price');
        var quantityElement = cartBox.querySelector('.cart-quantity');
        var productImg = cartBox.querySelector('.cart-img').src;

        var item = {
            title: titleElement.innerText,
            price: priceElement.innerText,
            quantity: quantityElement.value,
            productImg: productImg,
        };
        cartItems.push(item);
    }
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

// Loads in cart
function loadCartItems(){
    var cartItems = localStorage.getItem('cartItems');
    if(cartItems){
        cartItems = JSON.parse(cartItems);

        for(var i=0; i<cartItems.length; i++){
            var item = cartItems[i];
            addProductToCart(item.title, item.price, item.productImg);

            var cartBoxes = document.querySelectorAll(".cart-box");
            var cartBox = cartBoxes[cartBoxes.length - 1];
            var quantityElement = cartBox.querySelector(".cart-quantity");
            quantityElement.value = item.quantity;
        }
    }
    var total = localStorage.getItem('cartTotal');
    if(total){
        document.querySelector(".total-price").innerText = 'Rs.' + total;
    }
}

// Update cart icon quantity
function updateCartIcon() {
    var cartBoxes = document.querySelectorAll('.cart-box'); 
    var quantity = 0;

    for (var i = 0; i < cartBoxes.length; i++) {
        var cartBox = cartBoxes[i];
        var quantityElement = cartBox.querySelector('.cart-quantity'); 
        quantity += parseInt(quantityElement.value);
    }
    
    var cartIcon = document.querySelector('#cart-icon'); 
    cartIcon.setAttribute('data-quantity', quantity);
}
// Function to clear cart items from local storage
function clearCart() {
    localStorage.removeItem('cartItems');
    localStorage.removeItem('cartTotal');
}

// Modify the addCartClicked function to clear cart after adding item
function addCartClicked(event) {
    var button = event.target;
    var shopProduct = button.parentElement;
    var title = shopProduct.querySelector(".product-title").innerText;
    var price = shopProduct.querySelector(".price").innerText;
    var productImg = shopProduct.querySelector(".product-img").src;
    addProductToCart(title, price, productImg);
    updatetotal();
    saveCartItems();
    updateCartIcon();
    // Clear cart after adding item
    clearCart();
}

// Call clearCart function after loading cart items
loadCartItems();
clearCart();
