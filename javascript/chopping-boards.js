const openCart = document.getElementById("btnShoppingCart");
const closeCart = document.getElementById("btnCloseCart");
const modalContainer = document.getElementsByClassName("modalBox")[0];
const modalCart = document.getElementsByClassName("modalShoppingCart")[0];
const sendEmailPrompt = document.getElementById("emailConfirmButton");
const closeEmailPrompt = document.getElementById("btnCloseEmailPrompt");

const cartContainer = document.getElementById("cart-container");
const showChoppingBoards = document.getElementById("chopping-boards");
const cartQuantity = document.getElementById("cartQuantity");
const totalCost = document.getElementById("totalCost");


let shoppingCart = [];

choppingBoardsSection();

loadEventListeners();


// Event Listeners

openCart.addEventListener("click", () => { modalContainer.classList.toggle("modal-visible") });

closeCart.addEventListener("click", () => { modalContainer.classList.toggle("modal-visible") });

modalCart.addEventListener('click',(e)=>{ e.stopPropagation() });

modalContainer.addEventListener('click', () => { carritoCerrar.click() });

sendEmailPrompt.addEventListener("click", () => {

    document.getElementById("emailBox").style.visibility = "hidden";
    localStorage.setItem("firstUser", false);
});

closeEmailPrompt.addEventListener("click", () => {

    document.getElementById("emailBox").style.visibility = "hidden"
    localStorage.setItem("firstUser", false);
});


// Check if it is first time in the web if not get email prompt

let checkFirstUser = () => {

    if (localStorage["firstUser"]) {

    } else {

        getEmail();
    }
    
};


// Get Email Prompt

function getEmail() {

    setTimeout( () => {

        document.getElementById("emailBox").style.visibility = "visible";
    }, 5000);

};
 

//Load event listeners

function loadEventListeners() {

    showChoppingBoards.addEventListener("click", addToCart);
    
    modalCart.addEventListener("click", eliminateProduct);
    
    updateCart(shoppingCart);

    document.addEventListener('DOMContentLoaded', () => {

        shoppingCart = JSON.parse(localStorage.getItem("cart")) || [];
        cartHTML();
        updateCart(shoppingCart);
        checkFirstUser();
        
    });

    updateCart(shoppingCart);
    
};


// Show products in body

function choppingBoardsSection() {

    fetch("javascript/products-stock-data.json")
        .then(response => response.json())
        .then(data => {

            const myChoppingBoards = data.filter(function(products) {
                return products.category === "chopping-boards" 
            });
            
            myChoppingBoards.forEach (product => {
                
                const {id, img, name, price} = product;

                let div = document.createElement("div");
                div.classList.add("product");
                div.innerHTML = `
                                <div class="product-card" data-id=${id}>
                                    <div class="card-image">
                                        <img src= ${img}>
                                    </div>
                                    <p class= "card-title">
                                        ${name}
                                    </p>
                                    <p class= "card-price">
                                        $<span>${price}</span>
                                    </p>
                                    <button class="btnAddToCart" id="addToCartButton${id}" data-id="${id}"> Add to Cart </button>
                                </div>
                `;

                showChoppingBoards.appendChild(div);
        });
    });
};


// Add products to cart

function addToCart(e) {

    e.preventDefault();
    if (e.target.classList.contains("btnAddToCart")) {
        const selectedProduct = e.target.parentElement.parentElement;
        productInCart(selectedProduct);
        Toastify({
            text: "🛒 Product Added",
            duration: 2000,
            stopOnFocus: true,

            style: {
                background: "#f5e4bb",
                color: "#83472C"
            },
        }).showToast();
    };
    updateCart(shoppingCart);
};


// Elminating product from cart

function eliminateProduct(e) {
    
    if (e.target.classList.contains("eliminateProductFromCart")) {
        // console.log(e.target.getAttribute("data-id"));
        const productId = e.target.getAttribute("data-id");

        shoppingCart = shoppingCart.filter(product => product.id !== productId);
        Toastify({
            text: "❌ Product Removed",
            duration: 2000,
            stopOnFocus: true,

            style: {
                background: "#83472C",
                color: "#f5e4bb"
            },
        }).showToast();

        cartHTML();
    };
    updateCart(shoppingCart);
};


// Cleaning HTML

function cleanHTML() {

    while(cartContainer.firstChild) {
        cartContainer.removeChild(cartContainer.firstChild);
    };
};


//Update cart

function updateCart(shoppingCart) {

    cartQuantity.innerHTML = shoppingCart.reduce((acc, el) => acc + el.quantity, 0);
    totalCost.innerHTML = shoppingCart.reduce((acc, el) => acc + (el.price * el.quantity), 0).toFixed(2);

}


// Products in the shopping cart

function productInCart(product) {
    
    const productInfo = {

        id: product.querySelector("button").getAttribute("data-id"),
        name: product.querySelector(".card-title").textContent,
        price: product.querySelector(".card-price span").textContent,
        
        quantity: 1
    };

    const repeated = shoppingCart.some (product => product.id === productInfo.id);

    if (repeated) {

        const repeatedProducts = shoppingCart.map (product => {

            if (product.id === productInfo.id) {

                product.quantity ++;
                return product;
            } else {

                return product;
            }
        });
        shoppingCart = [...repeatedProducts];
    } else {

        shoppingCart = [...shoppingCart, productInfo];
    };

    cartHTML();
};


// Showing Shopping Cart

function cartHTML() {

    cleanHTML();

    shoppingCart.forEach (product => {

        const {name, price, quantity, id} = product;
        const div = document.createElement("div");

        div.className = "productInCart";
        div.innerHTML = `
                    <p>${name}</p>
                    <p>Price: $ ${price}</p>
                    <p id=quantity${id}>Quantity: ${quantity}</p>
                    <button class="eliminateProductFromCart" id="deleteButton${id}" data-id="${id}"> X </button>
        `;

        cartContainer.appendChild(div);
        updateCart(shoppingCart)
    });

    syncLocalStorage();
};


//  Setting Local Storage for Shopping Cart

function syncLocalStorage() {
    localStorage.setItem("cart", JSON.stringify(shoppingCart));
};


