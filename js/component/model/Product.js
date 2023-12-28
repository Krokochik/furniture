import {Bean} from "../service/Bean.js";

export class Product {
    /**
     * @type Number
     **/
    id;

    /**
     * @type String
     **/
    title;

    /**
     * @type Number
     **/
    price;

    /**
     * @type String
     **/
    description;

    /**
     * 0 to 5
     * @type Number
     **/
    rating;

    /**
     * @type URL
     **/
    image;

    /**
     * @param {JSON} json
     **/
    static ofJson(json) {
        let product = new Product();
        for (const field in product) {
            for (const key in json) {
                if (field === key) {
                    if (key === "rating") {
                        product.rating = +json[key] || +json[key].rate || json[key].rate;
                    } else if (key === "image") {
                        product.image = new URL(json[key]);
                    } else product[field] = json[key];
                }
            }
        }
        return product;
    }

    #addToCart() {
        Bean.cartService.addToCart(this.id, 1);
        window.location.hash = "/cart";
    }

    getPreviewNode() {
        const node = (`
            <div class="card">
                <div class="card__presentation">
                    <img src="${this.image}" alt="image">
                    <button class="card__to-cart">
                        <img src="/furniture/img/add-to-cart.svg" alt="to cart">
                    </button>
                </div>
                <a class="card__title" data-href="/product/${this.id}/">${this.title}</a>
                <span class="card__price">$ ${this.price}</span>
            </div>
        `).toNode();

        node.querySelectorAll("button.card__to-cart")
            .forEach(button => button
                .addEventListener("click", () =>
                    this.#addToCart()));

        return node;
    }

    getNode() {
        const node = (`
            <div class="product-container">
                <div class="product__image">
                    <img src="${this.image}" alt="image">
                </div>
                <div class="product">
                    <span class="product__title">${this.title}</span>
                    <div class="product__info">
                        <span class="product__price">$ ${this.price}</span>
                        <div class="product__rating">
                            <img src="/furniture/img/star.svg" alt="star">
                            <span>${this.rating}</span>
                        </div>
                    </div>
                    <p class="product__description">${this.description}</p>
                    <button class="product__to-cart">Add to cart</button>
                </div>
            </div>
        `).toNode();

        node.querySelectorAll("button.product__to-cart")
            .forEach(button => button
                .addEventListener("click", () =>
                    this.#addToCart()));

        return node;
    }
}
