import {Bean} from "./Bean.js";

let setCookie = (name, value, days) => {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = ";expires =" + date.toUTCString();
    }
    document.cookie = `${name}=${value || ""}${expires};`;
}

let getCookie = name => {
    name = name + "=";
    let cookies = document.cookie.split(";");
    for (const cookie of cookies) {
        if (cookie.includes(name))
            return cookie
                .substring(cookie.indexOf(name) + name.length);
    }
    return null;
}

let eraseCookie = name => {
    document.cookie = name + "=;Max-Age=-99999999;";
}

export class CartService {
    #CART_STORAGE_NAME = "cart";
    #cart;

    #cartListeners = [];

    async #updateCost() {
        let cost = 0;
        const products = await Bean.shopService.getProductList();

        for (const product of products) {
            for (let i in this.#cart.products) {
                if (this.#cart.products[i].id === product.id) {
                    cost += product.price * this.#cart.products[i].count;
                }
            }
        }

        this.#cart.cost = cost;
    }

    #saveCartToStorage() {
        setCookie(this.#CART_STORAGE_NAME, JSON.stringify(this.#cart), 7);
    }

    constructor() {
        const savedInstance = JSON.parse(getCookie(this.#CART_STORAGE_NAME));
        if (savedInstance) {
            this.#cart = savedInstance;
        } else {
            this.#cart = {
                products: [],
                count: 0,
                cost: 0
            }
            this.#saveCartToStorage();
        }
    }

    async addToCart(id, count) {
        id = Number(id);
        count = Number(count);

        if (!id) throw new TypeError(`Bad id: ${id}`);
        if (!count) count = 1;

        let productExists = false;
        for (let i in this.#cart.products) {
            if (this.#cart.products[i].id === id) {
                this.#cart.products[i].count += count;
                productExists = true;
                break;
            }
        }
        if (!productExists) {
            this.#cart.products.push({
                id: id,
                count: count
            })
        }
        this.#cart.count += count;
        await this.#updateCost();
        this.#cartChanged();
        this.#saveCartToStorage();
    }

    async removeFromCart(id, count) {
        id = Number(id);
        count = Number(count);

        if (!id) throw new TypeError(`Bad id: ${id}`);

        for (let i in this.#cart.products) {
            if (this.#cart.products[i].id === id) {
                const productCount = this.#cart.products[i].count;
                if (!count || count > productCount) count = productCount;

                this.#cart.products[i].count -= count;
                if (this.#cart.products[i].count <= 0) {
                    this.#cart.products.splice(i, 1);
                }
                this.#cart.count -= count;

                await this.#updateCost();
                this.#cartChanged();
                this.#saveCartToStorage();
                break;
            }
        }
    }

    async clearCart() {
        eraseCookie(this.#CART_STORAGE_NAME);
        this.#cart = {
            products: [],
            count: 0,
            cost: 0
        };
        await this.#updateCost();
        this.#cartChanged();
        this.#saveCartToStorage();
    }

    getCount() {
        return this.#cart.count;
    }

    getCost() {
        return this.#cart.cost;
    }

    getCart() {
        return this.#cart;
    }

    async #cartChanged() {
        this.#cartListeners.forEach(listener => {
            try{
                let call = async () => listener({
                    count: this.#cart.count,
                    cost: this.#cart.cost
                });
                call();
            } catch (Error) {}
        })
    }

    setOnCartChanged(callback) {
        this.removeOnCartChanged(callback);
        this.#cartListeners.push(callback);
    }

    removeOnCartChanged(callback) {
        for (let i in this.#cartListeners) {
            if (this.#cartListeners[i] === callback) {
                this.#cartListeners.splice(i, 1);
            }
        }
    }
}