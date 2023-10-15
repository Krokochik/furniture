import {Component, Requirement} from "./Component.js";

export class Shop extends Component {
    requirements = [
        Requirement.ofString(
            `<link rel="stylesheet" href="/css/shop.css">`
        ),
        Requirement.ofString(
            `<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Nunito">`
        )
    ];

    getNode() {
        let shop = `<div class="shop"></div>`.toNode();
        for (let i = 0; i < 12; i++) {
            shop.appendChild(`
                <div class="card">
                    <div class="card__presentation">
                        <img src="https://via.placeholder.com/500x700/00a4d6" alt="#">
                            <button class="card__put">
                                <img src="/img/add-to-cart.svg" alt="to cart">
                            </button>
                    </div>
                    <a class="card__title" href="#">Black simple lamp</a>
                    <span class="card__price">$ 12.00</span>
                </div>
            `.toNode());
        }
        return shop;
    }
}