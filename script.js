const WHATSAPP_NUMBER = "5519998470825";
const PIX_KEY = "samyraleitedasilvaferreira09@gmail.com";
const DELIVERY_FEE = 8.00;


/* ================================
   PRODUTOS
================================ */

const products = [
    {
        id: 1,
        name: "Cookie Tradicional Gotas",
        description: "Massa amanteigada com gotas de chocolate.",
        price: 13.00,
        tag: "Clássico",
        icon: "fa-cookie-bite"
    },

    {
        id: 2,
        name: "Cookie Nutella",
        description: "Recheado com muita Nutella pura.",
        price: 16.00,
        tag: "Recheado",
        icon: "fa-heart"
    },

    {
        id: 3,
        name: "Cookie Kinder Bueno",
        description: "Recheado com muito creme de Kinder Bueno.",
        price: 16.00,
        tag: "Especial",
        icon: "fa-star"
    }
];


let cart = [];

let customerData = {
    name: "",
    delivery: "",
    address: "",
    payment: "",
    cashGiven: 0
};


/* ================================
   ELEMENTOS
================================ */

const productsGrid = document.getElementById("products-grid");
const cartItemsList = document.getElementById("cart-items-list");
const cartBadge = document.getElementById("cart-badge-count");

const subtotalElement = document.getElementById("summary-subtotal");
const deliveryElement = document.getElementById("summary-delivery");
const totalElement = document.getElementById("summary-total");

const checkoutForm = document.getElementById("checkout-form");

const deliveryOption = document.getElementById("delivery-option");
const addressFieldWrapper = document.getElementById("address-field-wrapper");
const addressInput = document.getElementById("client-address");
const pickupInfo = document.getElementById("pickup-info");

const paymentMethod = document.getElementById("payment-method");
const cashChangeWrapper = document.getElementById("cash-change-wrapper");
const cashGivenInput = document.getElementById("cash-given");
const changePreview = document.getElementById("change-preview-text");

const step1Container = document.getElementById("step-1-container");
const step2Container = document.getElementById("step-2-container");

const paymentBoxContent = document.getElementById("payment-box-content");

const summaryClientName = document.getElementById("summary-client-name");
const summaryDeliveryType = document.getElementById("summary-delivery-type");
const summaryAddressLine = document.getElementById("summary-address-line");
const summaryAddressValue = document.getElementById("summary-address-val");
const summaryFinalTotal = document.getElementById("summary-final-total");

const whatsappButton = document.getElementById("whatsapp-button");
const backButton = document.getElementById("back-button");
const clearCartButton = document.getElementById("btn-clear-cart");
const cartButton = document.getElementById("cart-button");

const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toast-message");


/* ================================
   FORMATAÇÃO
================================ */

function formatPrice(value) {
    return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}


/* ================================
   MOSTRAR PRODUTOS
================================ */

function renderProducts() {

    productsGrid.innerHTML = "";

    products.forEach(function(product) {

        const card = document.createElement("article");

        card.className = "product-card";

        card.innerHTML = `
            <div class="product-image">

                <span class="product-tag">
                    ${product.tag}
                </span>

                <i class="fa-solid ${product.icon} product-icon"></i>

            </div>

            <div class="product-info">

                <h3>
                    ${product.name}
                </h3>

                <p class="product-description">
                    ${product.description}
                </p>

                <div class="product-bottom">

                    <span class="product-price">
                        ${formatPrice(product.price)}
                    </span>

                    <button
                        class="add-product-button"
                        onclick="addToCart(${product.id})"
                    >
                        <i class="fa-solid fa-plus"></i>
                    </button>

                </div>

            </div>
        `;

        productsGrid.appendChild(card);

    });
}


/* ================================
   ADICIONAR AO CARRINHO
================================ */

function addToCart(productId) {

    const product = products.find(function(item) {
        return item.id === productId;
    });

    if (!product) return;

    const existingItem = cart.find(function(item) {
        return item.id === productId;
    });

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            tag: product.tag,
            icon: product.icon,
            quantity: 1
        });
    }

    renderCart();

    showToast(product.name + " adicionado ao carrinho!");
}


/* ================================
   ALTERAR QUANTIDADE
================================ */

function changeQuantity(productId, change) {

    const item = cart.find(function(product) {
        return product.id === productId;
    });

    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        cart = cart.filter(function(product) {
            return product.id !== productId;
        });
    }

    renderCart();
}


/* ================================
   MOSTRAR CARRINHO
================================ */

function renderCart() {

    cartItemsList.innerHTML = "";

    if (cart.length === 0) {

        cartItemsList.innerHTML = `
            <div class="empty-cart">

                <i class="fa-solid fa-cookie"></i>

                <p>
                    Seu carrinho está vazio.
                </p>

                <span>
                    Adicione alguns cookies gostosos!
                </span>

            </div>
        `;

        cartBadge.textContent = "0";

        updateSummary();

        return;
    }


    cart.forEach(function(item) {

        const cartItem = document.createElement("div");

        cartItem.className = "cart-item";

        cartItem.innerHTML = `
            <div class="cart-item-image">
                <i class="fa-solid ${item.icon}"></i>
            </div>

            <div class="cart-item-info">

                <h4>
                    ${item.name}
                </h4>

                <span class="cart-item-price">
                    ${formatPrice(item.price)}
                </span>

            </div>

            <div class="quantity-control">

                <button
                    class="quantity-button"
                    onclick="changeQuantity(${item.id}, -1)"
                >
                    <i class="fa-solid fa-minus"></i>
                </button>

                <span class="quantity-value">
                    ${item.quantity}
                </span>

                <button
                    class="quantity-button"
                    onclick="changeQuantity(${item.id}, 1)"
                >
                    <i class="fa-solid fa-plus"></i>
                </button>

            </div>
        `;

        cartItemsList.appendChild(cartItem);

    });

    updateCartBadge();
    updateSummary();
}


/* ================================
   BADGE DO CARRINHO
================================ */

function updateCartBadge() {

    let totalItems = 0;

    cart.forEach(function(item) {
        totalItems += item.quantity;
    });

    cartBadge.textContent = totalItems;
}


/* ================================
   SUBTOTAL
================================ */

function calculateSubtotal() {

    let subtotal = 0;

    cart.forEach(function(item) {
        subtotal += item.price * item.quantity;
    });

    return subtotal;
}


/* ================================
   TOTAL
================================ */

function calculateTotal() {

    const subtotal = calculateSubtotal();

    let delivery = 0;

    if (deliveryOption.value === "entrega") {
        delivery = DELIVERY_FEE;
    }

    return subtotal + delivery;
}


/* ================================
   ATUALIZAR VALORES
================================ */

function updateSummary() {

    const subtotal = calculateSubtotal();

    let delivery = 0;

    if (deliveryOption.value === "entrega") {
        delivery = DELIVERY_FEE;
    }

    const total = subtotal + delivery;

    subtotalElement.textContent = formatPrice(subtotal);


    if (deliveryOption.value === "") {

        deliveryElement.textContent = "—";

    } else if (deliveryOption.value === "retirada") {

        deliveryElement.textContent = "Grátis";

    } else {

        deliveryElement.textContent = formatPrice(DELIVERY_FEE);

    }


    totalElement.textContent = formatPrice(total);

    updateChangePreview();
}


/* ================================
   ENTREGA / RETIRADA
================================ */

deliveryOption.addEventListener("change", function() {

    if (this.value === "entrega") {

        addressFieldWrapper.style.display = "block";

        addressInput.required = true;

        pickupInfo.style.display = "none";

    } else if (this.value === "retirada") {

        addressFieldWrapper.style.display = "none";

        addressInput.required = false;

        pickupInfo.style.display = "block";

    } else {

        addressFieldWrapper.style.display = "none";

        addressInput.required = false;

        pickupInfo.style.display = "none";

    }

    updateSummary();
});


/* ================================
   PAGAMENTO
================================ */

paymentMethod.addEventListener("change", function() {

    if (this.value === "Dinheiro") {

        cashChangeWrapper.style.display = "block";

    } else {

        cashChangeWrapper.style.display = "none";

        cashGivenInput.value = "";

        changePreview.textContent = "";
    }
});


/* ================================
   TROCO
================================ */

cashGivenInput.addEventListener("input", updateChangePreview);


function updateChangePreview() {

    if (paymentMethod.value !== "Dinheiro") {
        return;
    }

    const amountGiven = Number(cashGivenInput.value);

    const total = calculateTotal();

    if (!amountGiven) {

        changePreview.textContent = "";

        return;
    }

    if (amountGiven < total) {

        changePreview.style.color = "#c25b5b";

        changePreview.textContent =
            "O valor informado é menor que o total.";

        return;
    }

    const change = amountGiven - total;

    changePreview.style.color = "#5b8c5a";

    changePreview.textContent =
        "Troco: " + formatPrice(change);
}


/* ================================
   LIMPAR CARRINHO
================================ */

clearCartButton.addEventListener("click", function() {

    cart = [];

    renderCart();

    showToast("Carrinho limpo!");

});


/* ================================
   AVANÇAR PARA PAGAMENTO
================================ */

checkoutForm.addEventListener("submit", function(event) {

    event.preventDefault();


    if (cart.length === 0) {

        showToast("Adicione pelo menos um cookie ao carrinho.");

        return;
    }


    const name =
        document.getElementById("client-name").value.trim();


    const delivery =
        deliveryOption.value;


    const address =
        addressInput.value.trim();


    const payment =
        paymentMethod.value;


    const cashGiven =
        Number(cashGivenInput.value);


    if (!name) {

        showToast("Digite seu nome.");

        return;
    }


    if (!delivery) {

        showToast("Escolha a forma de envio.");

        return;
    }


    if (delivery === "entrega" && !address) {

        showToast("Digite o endereço para entrega.");

        return;
    }


    if (!payment) {

        showToast("Escolha a forma de pagamento.");

        return;
    }


    if (payment === "Dinheiro" && !cashGiven) {

        showToast("Informe o valor em dinheiro.");

        return;
    }


    if (
        payment === "Dinheiro" &&
        cashGiven < calculateTotal()
    ) {

        showToast("O valor informado é menor que o total.");

        return;
    }


    customerData = {
        name: name,
        delivery: delivery,
        address: address,
        payment: payment,
        cashGiven: cashGiven
    };


    showPaymentStep();

});


/* ================================
   ETAPA DE PAGAMENTO
================================ */

function showPaymentStep() {

    step1Container.style.display = "none";

    step2Container.style.display = "block";


    summaryClientName.textContent =
        customerData.name;


    if (customerData.delivery === "entrega") {

        summaryDeliveryType.textContent =
            "Entrega (+ R$ 8,00)";

        summaryAddressLine.style.display = "flex";

        summaryAddressValue.textContent =
            customerData.address;

    } else {

        summaryDeliveryType.textContent =
            "Retirada";

        summaryAddressLine.style.display = "flex";

        summaryAddressValue.textContent =
            "Rua Rio Tibre, nº 48, Jardim Figueira";
    }


    summaryFinalTotal.textContent =
        formatPrice(calculateTotal());


    renderPaymentBox();

    document.querySelector(".cart-section").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


/* ================================
   PAGAMENTO PIX / DINHEIRO
================================ */

function renderPaymentBox() {

    if (customerData.payment === "Pix") {

        paymentBoxContent.innerHTML = `
            <div class="pix-box">

                <i class="fa-solid fa-bolt"></i>

                <h3>
                    Pagamento via Pix
                </h3>

                <p>
                    Faça o pagamento usando a chave Pix abaixo.
                </p>

                <div class="pix-key">
                    ${PIX_KEY}
                </div>

                <button
                    type="button"
                    class="copy-pix-button"
                    id="copy-pix-button"
                >
                    <i class="fa-solid fa-copy"></i>
                    Copiar chave Pix
                </button>

            </div>
        `;


        document
            .getElementById("copy-pix-button")
            .addEventListener("click", copyPixKey);


    } else {

        const total = calculateTotal();

        const change =
            customerData.cashGiven - total;


        paymentBoxContent.innerHTML = `
            <div class="money-box">

                <i class="fa-solid fa-money-bill-wave"></i>

                <h3>
                    Pagamento em Dinheiro
                </h3>

                <p>
                    Valor entregue:
                    <strong>
                        ${formatPrice(customerData.cashGiven)}
                    </strong>
                </p>

                <p>
                    Total:
                    <strong>
                        ${formatPrice(total)}
                    </strong>
                </p>

                <p>
                    Troco:
                    <strong>
                        ${formatPrice(change)}
                    </strong>
                </p>

            </div>
        `;
    }
}


/* ================================
   COPIAR PIX
================================ */

function copyPixKey() {

    navigator.clipboard.writeText(PIX_KEY);

    showToast("Chave Pix copiada!");

}


/* ================================
   VOLTAR
================================ */

backButton.addEventListener("click", function() {

    step2Container.style.display = "none";

    step1Container.style.display = "block";

});


/* ================================
   WHATSAPP
================================ */

whatsappButton.addEventListener("click", function() {

    let message =
        "🍪 *NOVO PEDIDO - MIMI COOKIES*%0A%0A";


    message +=
        "👤 *Cliente:* " +
        customerData.name +
        "%0A%0A";


    message += "*🍪 PEDIDO:*%0A";


    cart.forEach(function(item) {

        const itemTotal =
            item.price * item.quantity;

        message +=
            "• " +
            item.quantity +
            "x " +
            item.name +
            " - " +
            formatPrice(itemTotal) +
            "%0A";
    });


    const subtotal =
        calculateSubtotal();


    const deliveryFee =
        customerData.delivery === "entrega"
            ? DELIVERY_FEE
            : 0;


    const total =
        subtotal + deliveryFee;


    message +=
        "%0A*Subtotal:* " +
        formatPrice(subtotal) +
        "%0A";


    if (customerData.delivery === "entrega") {

        message +=
            "*Taxa de entrega:* " +
            formatPrice(DELIVERY_FEE) +
            "%0A";

        message +=
            "*Endereço:* " +
            customerData.address +
            "%0A";

    } else {

        message +=
            "*Forma de envio:* Retirada%0A";

        message +=
            "*Local:* Rua Rio Tibre, nº 48, Jardim Figueira%0A";
    }


    message +=
        "%0A*💰 TOTAL:* " +
        formatPrice(total) +
        "%0A";


    message +=
        "*💳 Pagamento:* " +
        customerData.payment +
        "%0A";


    if (customerData.payment === "Pix") {

        message +=
            "*Chave Pix:* " +
            PIX_KEY +
            "%0A";
    }


    if (customerData.payment === "Dinheiro") {

        const change =
            customerData.cashGiven - total;

        message +=
            "*Valor entregue:* " +
            formatPrice(customerData.cashGiven) +
            "%0A";

        message +=
            "*Troco:* " +
            formatPrice(change) +
            "%0A";
    }


    message +=
        "%0A🍪 Obrigada pelo pedido!";


    const url =
        "https://wa.me/" +
        WHATSAPP_NUMBER +
        "?text=" +
        message;


    window.open(url, "_blank");

});


/* ================================
   BOTÃO CARRINHO
================================ */

cartButton.addEventListener("click", function() {

    document.querySelector(".cart-section").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

});


/* ================================
   TOAST
================================ */

let toastTimeout;


function showToast(message) {

    toastMessage.textContent = message;

    toast.classList.add("show");


    clearTimeout(toastTimeout);


    toastTimeout = setTimeout(function() {

        toast.classList.remove("show");

    }, 2500);

}


/* ================================
   INICIAR SITE
================================ */

renderProducts();

renderCart();

updateSummary();