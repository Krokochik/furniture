import {Component} from "../model/Component.js";
import {Requirement} from "../model/Requirement.js";
import {Bean} from "../service/Bean.js";

export class Header extends Component {
    requirements = [
        Requirement.ofString(
            `<link rel="stylesheet" href="/css/header.css">`
        ),
        Requirement.ofString(
            `<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Gelasio">`
        ),
        Requirement.ofString(
            `<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Nunito">`
        )
    ];

    #node;

    async init(params) {
        super.init();
        this.#node = (`
            <header class="header">
                <form class="header__search">
                    <button type="button">
                        <img src="/img/search.svg" alt="search"> 
                    </button>
                    <input id="search" type="text">
                </form>
                <div class="header__title">
                    <span>Make home</span>
                    <span>Beautiful</span>
                </div>
                <div class="header__cart">
                    <button class="header-cart__link" data-href="/cart">
                        <span id="header__count"></span>
                        <img src="/img/cart.svg" alt="cart">
                    </button>
                    <span id="header__cost" class="header-cart__value">$ 0.00</span>
                </div>
            </header>
        `).toNode();

        const cartService = Bean.cartService;
        const count = this.#node.querySelector("#header__count");
        const cost = this.#node.querySelector("#header__cost");
        const cart = this.#node.querySelector("button.header-cart__link");

        const getCountWidth = () => {
            if (cart.innerText === "0") return 0;

            const padding = 5;
            const span = count.cloneNode(true);

            span.style.font = "11px Arial";
            span.textContent = count.textContent;
            span.style.visibility = "hidden";

            document.body.appendChild(span);
            let width = span.offsetWidth + padding * 2;
            document.body.removeChild(span);

            return width;
        };

        const updateView = (countValue, costValue) => {
            count.innerText = countValue;
            if (count.innerText !== "0") {
                cart.style.paddingRight = getCountWidth() - 6;
                count.style.visibility = "visible";
            } else {
                cart.style.paddingRight = 5;
                count.style.visibility = "hidden";
            }
            cost.innerText = "$ " + costValue.toFixed(2);
        };

        updateView(cartService.getCount(), cartService.getCost());

        const listener = values =>
            updateView(values.count, values.cost);
        cartService.setOnCartChanged(values => listener(values));
    }

    getNode() {
        return this.#node;
    }
}