const WHATSAPP_NUMBER = "5519998470825";
const PIX_KEY = "samyraleitedasilvaferreira09@gmail.com";
const DELIVERY_FEE = 8.00;

// ===============================
// PRODUTOS
// ===============================

const products = [
    {
        id: 1,
        name: "Cookie Tradicional Gotas",
        price: 13.00,
        description: "Massa amanteigada com gotas de chocolate.",
        icon: "fa-cookie-bite"
    },
    {
        id: 2,
        name: "Cookie Nutella",
        price: 16.00,
        description: "Recheado com muita Nutella pura.",
        icon: "fa-cookie"
    },
    {
        id: 3,
        name: "Cookie Kinder Bueno",
        price: 16.00,
        description: "Recheado com muito creme de Kinder Bueno.",
        icon: "fa-cookie-bite"
    }
];

// ===============================
// CARRINHO
// ===============================

let cart = [];


// ===============================
// HORÁRIO DE FUNCIONAMENTO
// Segunda a sábado: 13h às 21h
// Domingo: fechado
// ===============================

function verificarHorario() {
    const agora = new Date();

    const dia = agora.getDay();
    const hora = agora.getHours();

    // 0 = domingo
    // 1 = segunda
    // 2 = terça
    // 3 = quarta
    // 4 = quinta
    // 5 = sexta
    // 6 = sábado

    return dia >= 1 && dia <= 6 && hora >= 13 && hora < 21;
}


// ===============================
// ELEMENTOS
// ===============================

const productsContainer = document.getElementById("products-container");
const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartSubtotal = document.getElementById("cart-subtotal");
const cartDelivery = document.getElementById("cart-delivery");
const cartTotal = document.getElementById("cart-total");

const deliveryOption = document.getElementById("delivery-option");
const addressWrapper = document.getElementById("address-wrapper");
const addressInput = document.getElementById("address");

const paymentOption = document.getElementById("payment-option");
const changeWrapper = document.getElementById("change-wrapper");
const changeInput = document.getElementById("change");

const checkoutForm = document.getElementById("checkout-form");
const customerName = document.getElementById("customer-name");

const step1 = document.getElementById("step-1");
const step2 = document.getElementById("step-2");

const orderSummary = document.getElementById("order-summary");
const pixInfo = document.getElementById("pix-info");
const cashInfo = document.getElementById("cash-info");

const finalTotal = document.getElementById("final-total");

const copyPixButton = document.getElementById("copy-pix");


// ===============================
// MOSTRAR PRODUTOS
// ===============================

function renderProducts() {

    if (!productsContainer) {
        return;
    }

    productsContainer.innerHTML = "";

    products.forEach(product => {

        const card = document.createElement("div");

        card.className = "product-card";

        card.innerHTML = `
            <div class="product-icon">
                <i class="fa-solid ${product.icon}"></i>
            </div>

            <div class="product-info">

                <h3>${product.name}</h3>

                <p>${product.description}</p>

                <div class="product-bottom">

                    <strong>R$ ${product.price.toFixed(2).replace(".", ",")}</strong>

                    <button 
                        class="add-button"
                        onclick="addToCart(${product.id})"
                    >
                        Adicionar
                    </button>

                </div>

            </div>
        `;

        productsContainer.appendChild(card);
    });
}


// ===============================
// ADICIONAR AO CARRINHO
// ===============================

function addToCart(productId) {

    if (!verificarHorario()) {
        alert(
            "Estamos fechados no momento! 🍪\n\n" +
            "Nosso horário de atendimento é de segunda a sábado, das 13h às 21h."
        );

        return;
    }

    const product = products.find(item => item.id === productId);

    if (!product) {
        return;
    }

    const existingProduct = cart.find(item => item.id === productId);

    if (existingProduct) {

        existingProduct.quantity++;

    } else {

        cart.push({
            ...product,
            quantity: 1
        });

    }

    renderCart();
    updateSummary();
}


// ===============================
// DIMINUIR QUANTIDADE
// ===============================

function decreaseQuantity(productId) {

    const product = cart.find(item => item.id === productId);

    if (!product) {
        return;
    }

    product.quantity--;

    if (product.quantity <= 0) {

        cart = cart.filter(item => item.id !== productId);

    }

    renderCart();
    updateSummary();
}


// ===============================
// AUMENTAR QUANTIDADE
// ===============================

function increaseQuantity(productId) {

    if (!verificarHorario()) {
        alert(
            "Estamos fechados no momento! 🍪\n\n" +
            "Nosso horário de atendimento é de segunda a sábado, das 13h às 21h."
        );

        return;
    }

    const product = cart.find(item => item.id === productId);

    if (!product) {
        return;
    }

    product.quantity++;

    renderCart();
    updateSummary();
}


// ===============================
// RENDERIZAR CARRINHO
// ===============================

function renderCart() {

    if (!cartItems) {
        return;
    }

    cartItems.innerHTML = "";

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fa-solid fa-basket-shopping"></i>
                <p>Seu carrinho está vazio.</p>
            </div>
        `;

    } else {

        cart.forEach(product => {

            const item = document.createElement("div");

            item.className = "cart-item";

            item.innerHTML = `
                <div class="cart-item-info">

                    <strong>${product.name}</strong>

                    <span>
                        R$ ${product.price.toFixed(2).replace(".", ",")}
                    </span>

                </div>

                <div class="quantity-controls">

                    <button onclick="decreaseQuantity(${product.id})">
                        -
                    </button>

                    <span>${product.quantity}</span>

                    <button onclick="increaseQuantity(${product.id})">
                        +
                    </button>

                </div>
            `;

            cartItems.appendChild(item);
        });
    }

    updateCartCount();
}


// ===============================
// CONTADOR DO CARRINHO
// ===============================

function updateCartCount() {

    if (!cartCount) {
        return;
    }

    const totalItems = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    cartCount.textContent = totalItems;
}


// ===============================
// SUBTOTAL
// ===============================

function calculateSubtotal() {

    return cart.reduce(
        (total, item) => total + (item.price * item.quantity),
        0
    );
}


// ===============================
// ATUALIZAR RESUMO
// ===============================

function updateSummary() {

    const subtotal = calculateSubtotal();

    let delivery = 0;

    if (deliveryOption) {

        if (deliveryOption.value === "entrega") {

            delivery = DELIVERY_FEE;

            if (cartDelivery) {
                cartDelivery.textContent =
                    `R$ ${DELIVERY_FEE.toFixed(2).replace(".", ",")}`;
            }

        } else if (deliveryOption.value === "retirada") {

            delivery = 0;

            if (cartDelivery) {
                cartDelivery.textContent = "Grátis";
            }

        } else {

            if (cartDelivery) {
                cartDelivery.textContent = "—";
            }
        }
    }

    const total = subtotal + delivery;

    if (cartSubtotal) {
        cartSubtotal.textContent =
            `R$ ${subtotal.toFixed(2).replace(".", ",")}`;
    }

    if (cartTotal) {
        cartTotal.textContent =
            `R$ ${total.toFixed(2).replace(".", ",")}`;
    }

    if (finalTotal) {
        finalTotal.textContent =
            `R$ ${total.toFixed(2).replace(".", ",")}`;
    }
}


// ===============================
// ENTREGA / RETIRADA
// ===============================

if (deliveryOption) {

    deliveryOption.addEventListener("change", function () {

        if (this.value === "entrega") {

            if (addressWrapper) {
                addressWrapper.style.display = "block";
            }

        } else {

            if (addressWrapper) {
                addressWrapper.style.display = "none";
            }

            if (addressInput) {
                addressInput.value = "";
            }
        }

        updateSummary();
    });
}


// ===============================
// PAGAMENTO
// ===============================

if (paymentOption) {

    paymentOption.addEventListener("change", function () {

        if (this.value === "dinheiro") {

            if (changeWrapper) {
                changeWrapper.style.display = "block";
            }

        } else {

            if (changeWrapper) {
                changeWrapper.style.display = "none";
            }

            if (changeInput) {
                changeInput.value = "";
            }
        }
    });
}


// ===============================
// AVANÇAR PARA PAGAMENTO
// ===============================

if (checkoutForm) {

    checkoutForm.addEventListener("submit", function(event) {

        event.preventDefault();

        // Verifica horário
        if (!verificarHorario()) {

            alert(
                "Estamos fechados no momento! 🍪\n\n" +
                "Nosso horário de atendimento é de segunda a sábado, das 13h às 21h."
            );

            return;
        }

        // Verifica carrinho
        if (cart.length === 0) {

            alert("Adicione pelo menos um produto ao carrinho.");

            return;
        }

        // Verifica nome
        if (!customerName || customerName.value.trim() === "") {

            alert("Digite seu nome.");

            return;
        }

        // Verifica entrega
        if (!deliveryOption || deliveryOption.value === "") {

            alert("Escolha entre Entrega ou Retirada.");

            return;
        }

        // Verifica endereço
        if (
            deliveryOption.value === "entrega" &&
            (!addressInput || addressInput.value.trim() === "")
        ) {

            alert("Digite seu endereço para a entrega.");

            return;
        }

        // Verifica pagamento
        if (!paymentOption || paymentOption.value === "") {

            alert("Escolha uma forma de pagamento.");

            return;
        }

        // Verifica troco
        if (
            paymentOption.value === "dinheiro" &&
            (!changeInput || changeInput.value.trim() === "")
        ) {

            alert("Informe para quanto precisa de troco.");

            return;
        }

        gerarResumoPedido();

        if (step1) {
            step1.style.display = "none";
        }

        if (step2) {
            step2.style.display = "block";
        }

        // Rola para o início do pagamento
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}


// ===============================
// GERAR RESUMO DO PEDIDO
// ===============================

function gerarResumoPedido() {

    if (!orderSummary) {
        return;
    }

    orderSummary.innerHTML = "";

    cart.forEach(product => {

        const item = document.createElement("div");

        item.className = "summary-item";

        const itemTotal = product.price * product.quantity;

        item.innerHTML = `
            <span>
                ${product.quantity}x ${product.name}
            </span>

            <strong>
                R$ ${itemTotal.toFixed(2).replace(".", ",")}
            </strong>
        `;

        orderSummary.appendChild(item);
    });

    const subtotal = calculateSubtotal();

    let delivery = 0;

    if (deliveryOption && deliveryOption.value === "entrega") {
        delivery = DELIVERY_FEE;
    }

    const total = subtotal + delivery;

    const deliveryText =
        deliveryOption && deliveryOption.value === "entrega"
            ? `R$ ${DELIVERY_FEE.toFixed(2).replace(".", ",")}`
            : "Grátis";

    const details = document.createElement("div");

    details.className = "summary-total";

    details.innerHTML = `
        <div>
            <span>Subtotal</span>
            <strong>
                R$ ${subtotal.toFixed(2).replace(".", ",")}
            </strong>
        </div>

        <div>
            <span>Entrega</span>
            <strong>${deliveryText}</strong>
        </div>

        <div class="total-final">
            <span>Total</span>
            <strong>
                R$ ${total.toFixed(2).replace(".", ",")}
            </strong>
        </div>
    `;

    orderSummary.appendChild(details);


    // ===============================
    // PAGAMENTO PIX
    // ===============================

    if (paymentOption && paymentOption.value === "pix") {

        if (pixInfo) {

            pixInfo.style.display = "block";

            pixInfo.innerHTML = `
                <p><strong>Pagamento via Pix</strong></p>

                <p>
                    Chave Pix:
                </p>

                <div class="pix-key">
                    ${PIX_KEY}
                </div>

                <button type="button" id="copy-pix">
                    Copiar chave Pix
                </button>
            `;

            const newCopyButton =
                document.getElementById("copy-pix");

            if (newCopyButton) {

                newCopyButton.addEventListener("click", function() {

                    navigator.clipboard.writeText(PIX_KEY);

                    newCopyButton.textContent =
                        "Chave copiada!";

                    setTimeout(() => {

                        newCopyButton.textContent =
                            "Copiar chave Pix";

                    }, 2000);
                });
            }
        }

        if (cashInfo) {
            cashInfo.style.display = "none";
        }

    } else {

        if (pixInfo) {
            pixInfo.style.display = "none";
        }

        if (cashInfo) {

            cashInfo.style.display = "block";

            const trocoPara = parseFloat(changeInput.value);

            const troco = trocoPara - total;

            cashInfo.innerHTML = `
                <p>
                    <strong>Pagamento em dinheiro</strong>
                </p>

                <p>
                    Troco para:
                    R$ ${trocoPara.toFixed(2).replace(".", ",")}
                </p>

                <p>
                    Troco:
                    <strong>
                        R$ ${Math.max(0, troco).toFixed(2).replace(".", ",")}
                    </strong>
                </p>
            `;
        }
    }
}


// ===============================
// VOLTAR PARA DADOS DO PEDIDO
// ===============================

const backButton = document.getElementById("back-button");

if (backButton) {

    backButton.addEventListener("click", function() {

        if (step2) {
            step2.style.display = "none";
        }

        if (step1) {
            step1.style.display = "block";
        }

    });
}


// ===============================
// ENVIAR PEDIDO PELO WHATSAPP
// ===============================

const whatsappButton =
    document.getElementById("whatsapp-button");

if (whatsappButton) {

    whatsappButton.addEventListener("click", function() {

        // Verifica novamente o horário
        if (!verificarHorario()) {

            alert(
                "Estamos fechados no momento! 🍪\n\n" +
                "Nosso horário de atendimento é de segunda a sábado, das 13h às 21h."
            );

            return;
        }

        if (cart.length === 0) {

            alert("Seu carrinho está vazio.");

            return;
        }

        const name = customerName.value.trim();

        const delivery =
            deliveryOption.value === "entrega"
                ? "Entrega"
                : "Retirada";

        const address =
            deliveryOption.value === "entrega"
                ? addressInput.value.trim()
                : "Rua Rio Tibre, nº 48, Jardim Figueira";

        const payment =
            paymentOption.value === "pix"
                ? "Pix"
                : "Dinheiro";

        const subtotal = calculateSubtotal();

        const deliveryFee =
            deliveryOption.value === "entrega"
                ? DELIVERY_FEE
                : 0;

        const total = subtotal + deliveryFee;

        let message = "";

        message += "🍪 *NOVO PEDIDO - MIMI COOKIES* 🍪\n\n";

        message += `*Nome:* ${name}\n\n`;

        message += "*Pedido:*\n";

        cart.forEach(product => {

            const itemTotal =
                product.price * product.quantity;

            message +=
                `• ${product.quantity}x ${product.name} - R$ ${itemTotal.toFixed(2).replace(".", ",")}\n`;
        });

        message += "\n";

        message +=
            `*Subtotal:* R$ ${subtotal.toFixed(2).replace(".", ",")}\n`;

        if (deliveryOption.value === "entrega") {

            message +=
                `*Entrega:* R$ ${DELIVERY_FEE.toFixed(2).replace(".", ",")}\n`;

            message +=
                `*Endereço:* ${address}\n`;

        } else {

            message += "*Retirada:* Grátis\n";

            message +=
                `*Local de retirada:* ${address}\n`;
        }

        message += "\n";

        message +=
            `*Total:* R$ ${total.toFixed(2).replace(".", ",")}\n`;

        message +=
            `*Pagamento:* ${payment}\n`;

        if (payment === "Dinheiro") {

            const changeFor =
                parseFloat(changeInput.value);

            const change =
                Math.max(0, changeFor - total);

            message +=
                `*Troco para:* R$ ${changeFor.toFixed(2).replace(".", ",")}\n`;

            message +=
                `*Troco:* R$ ${change.toFixed(2).replace(".", ",")}\n`;
        }

        message += "\n";

        message += "Obrigada pelo pedido! 🤍🍪";

        const whatsappURL =
            `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

        window.open(whatsappURL, "_blank");
    });
}


// ===============================
// STATUS DE FUNCIONAMENTO
// ===============================

function mostrarStatusFuncionamento() {

    const aberto = verificarHorario();

    const statusElement =
        document.getElementById("status-funcionamento");

    if (!statusElement) {
        return;
    }

    if (aberto) {

        statusElement.textContent =
            "● Estamos abertos!";

        statusElement.classList.remove("fechado");

        statusElement.classList.add("aberto");

    } else {

        statusElement.textContent =
            "● Estamos fechados";

        statusElement.classList.remove("aberto");

        statusElement.classList.add("fechado");
    }
}


// ===============================
// INICIAR SITE
// ===============================

renderProducts();

renderCart();

updateSummary();

mostrarStatusFuncionamento();


// Atualiza o status automaticamente
// a cada 1 minuto

setInterval(() => {

    mostrarStatusFuncionamento();

}, 60000);