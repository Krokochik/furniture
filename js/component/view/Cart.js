import {Component} from "../model/Component.js";
import {Requirement} from "../model/Requirement.js";
import {ShopService} from "../service/ShopService.js";
import {Bean} from "../service/Bean.js";
import {Product} from "../model/Product.js";

export class Cart extends Component {
    requirements = [
        Requirement.ofString(
            `<link rel="stylesheet" href="/furniture/css/cart.css">`
        ),
        Requirement.ofString(
            `<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Nunito+Sans">`
        )
    ];

    #node;

    async init(params) {
        super.init();
        this.#node = (`<ul class="cart"></ul>`).toNode();

        const cartService = Bean.cartService;
        const shopService = Bean.shopService;
        const products = await shopService.getProductList();

        const cart = cartService.getCart();
        for (let i in cart.products) {
            for (const product of products) {
                if (product.id === cart.products[i].id) {
                    let count = cart.products[i].count;
                    if (count.toString().length === 1) count = "0".concat(count);

                    const child = (`
                        <li class="cart__position">
                            <img class="cart__img"
                                src="${product.image}"
                                alt="image">
                            <div class="cart__content">
                                <div class="cart__info">
                                    <div>
                                        <span class="cart__title">${product.title}</span>
                                        <span class="cart__price">$ ${product.price}</span>
                                    </div>
                                    <button class="cart__exclude">
                                            <img src="/img/cross.svg" alt="exclude">
                                    </button>
                                </div>
                                <div class="cart__count">
                                    <button class="active"><img src="/img/add-active.svg" alt="+"></button>
                                    <input class="cart__input" type="number" min="01" value="${count}">
                                    <button class="inactive"><img src="/img/pop-active.svg" alt="-"></button>
                                </div>
                            </div> 
                        </li>
                    `).toNode();

                    child.querySelector("button.cart__exclude")
                        .addEventListener("click", () => {
                            child.remove();
                            cartService.removeFromCart(product.id, count);
                        })

                    const countButtons = child.querySelector("div.cart__count").querySelectorAll("button");
                    const input = child.querySelector("div.cart__count").querySelector("input.cart__input");
                    const addButton = countButtons[0];
                    const removeButton = countButtons[1];
                    let previousInputValue = input.value;

                    const forbidAdd = () => {
                        addButton.querySelector("img").src = "/img/add-inactive.svg";
                        addButton.classList.remove("active");
                        addButton.classList.add("inactive");
                        addButton.disabled = true;
                    };

                    const permitAdd = () => {
                        addButton.querySelector("img").src = "/img/add-active.svg";
                        addButton.classList.remove("inactive");
                        addButton.classList.add("active");
                        addButton.disabled = false;
                    };

                    const forbidRemove = () => {
                        removeButton.querySelector("img").src = "/img/pop-inactive.svg";
                        removeButton.classList.remove("active");
                        removeButton.classList.add("inactive");
                        removeButton.disabled = true;
                    };

                    const permitRemove = () => {
                        removeButton.querySelector("img").src = "/img/pop-active.svg";
                        removeButton.classList.remove("inactive");
                        removeButton.classList.add("active");
                        removeButton.disabled = false;
                    };

                    const checkCount = () => {
                        if (input.value <= 99) permitAdd(); else forbidAdd();
                        if (input.value > 1) permitRemove(); else forbidRemove();
                    };

                    checkCount();

                    addButton.addEventListener("click", () => {
                        cartService.addToCart(product.id, 1);
                        count = +input.value + 1;
                        if (count.toString().length === 1) count = "0".concat(count);
                        input.value = count;
                        checkCount();
                        previousInputValue = input.value;
                    });

                    removeButton.addEventListener("click", () => {
                        cartService.removeFromCart(product.id, 1);
                        count = Math.max(+input.value - 1, 1);
                        if (count.toString().length === 1) count = "0".concat(count);
                        input.value = count;
                        checkCount();
                        previousInputValue = input.value;
                    });

                    input.addEventListener("change", event => {
                        let value = input.value;

                        if (value < 0) value = Math.abs(value);
                        if (value < 1 || value > 99) value = previousInputValue;
                        if (value.toString().length === 1) value = "0".concat(value);

                        input.value = value;

                        if (value !== previousInputValue) {
                            if (value > previousInputValue) {
                                cartService.addToCart(product.id,value - previousInputValue);
                            } else {
                                cartService.removeFromCart(product.id, previousInputValue - value);
                            }
                        }

                        previousInputValue = value;
                        checkCount();
                    });

                    this.#node.appendChild(child);
                }
            }
        }
    }

    getNode() {
        return this.#node;
    }
}
