import {Component, Requirement} from "./Component.js";

export class Header extends Component {
    requirements = [
        Requirement.ofString(
            `<link rel="stylesheet" href="/css/header.css">`
        ),
        Requirement.ofString(
            `<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Gelasio">`
        )
    ];

    getNode() {
        return `
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
                <div class="cart header__cart">
                    <button class="cart__link">
                        <span>1</span>
                        <img src="/img/cart.svg" alt="cart">
                    </button>
                    <span class="cart__value">$ 568.00</span>
                </div>
            </header>
        `.toNode();
    }
}