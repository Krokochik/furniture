import {Product} from "../model/Product.js";
import {Cipher} from "./Cipher.js";

export class ShopService {
    #SERVER_ENDPOINT = "https://fakestoreapi.com";
    #PRODUCT_LIST_STORAGE_NAME = "productList";

    /**
     * Produces the hash of server-given product list.
     * @return {Promise<string>}
     **/
    async requestAssortmentHash() {
        const productList = await this.requestProductList();
        return await Cipher.sha256(JSON.stringify(productList));
    }

    async requestProductHash(id) {
        let response;
        try {
            response = await (await fetch(
                `${this.#SERVER_ENDPOINT}/products/${id}`,
                {mode: "cors"}
            )).json();
        } catch (SyntaxError) {
            throw new RangeError(`Id ${id} is out of bounds`)
        }
        if (!response || !response.id || !response.id === id)
            throw new RangeError(`Id ${id} is out of bounds`);

        const responseProduct = {};
        const product = new Product();
        for (let key in product) {
            if (key === "rating") {
                responseProduct.rating = response.rating.rate;
            } else responseProduct[key] = response[key];
        }

        return await Cipher.sha256(JSON.stringify(responseProduct));
    }

    /**
     * @return {Promise<Product[]>}
     **/
    async requestProductList() {
        let list = [];
        let response = await (await fetch(
            `${this.#SERVER_ENDPOINT}/products`, {mode: "cors"})).json();
        for (let i = 0; ; i++) {
            if (response[i] === undefined) break;
            list.push(Product.ofJson(response[i]));
        }
        return list;
    }

    async downloadProductList() {
        console.log("downloading...")
        const productList = await this.requestProductList();
        const hashedProductList = {
            list: [],
            hash: ""
        };

        hashedProductList.hash = await Cipher
            .sha256(JSON.stringify(productList));
        for (let i in productList) {
            hashedProductList.list.push({
                product: productList[i],
                hash: await Cipher.sha256(JSON.stringify(productList[i]))
            })
        }

        localStorage.setItem(this.#PRODUCT_LIST_STORAGE_NAME,
            JSON.stringify(hashedProductList));
        console.log("downloaded")
    }

    async getProductList() {
        if (!localStorage.getItem(this.#PRODUCT_LIST_STORAGE_NAME))
            await this.downloadProductList();

        const savedInstance = JSON.parse(localStorage.getItem(
            this.#PRODUCT_LIST_STORAGE_NAME));

        if (savedInstance.hash !== await this.requestAssortmentHash()) {
            await this.downloadProductList();
            return await this.getProductList();
        }

        const productList = [];
        for (let i in savedInstance.list) {
            productList.push(Product.ofJson(
                savedInstance.list[i].product));
        }

        return productList;
    }

    /**
     * @param {Number} id
     **/
    async getProduct(id) {
        const productList = await this.getProductList();

        for (let i in productList) {
            if (productList[i].id === id) {
                return productList[i];
            }
        }

        throw new RangeError(`Product id ${id} is out of bounds`);
    }
}