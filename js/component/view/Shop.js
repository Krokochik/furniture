import {Component} from "../model/Component.js";
import {Requirement} from "../model/Requirement.js";
import {ShopService} from "../service/ShopService.js";
import {Bean} from "../service/Bean.js";

export class Shop extends Component {
    requirements = [
        Requirement.ofString(
            `<link rel="stylesheet" href="/furniture/css/shop.css">`
        ),
        Requirement.ofString(
            `<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Nunito">`
        )
    ];

    /**
     * @type Node
     **/
    #node;

    async init(params) {
        super.init();
        const productList = await Bean.shopService.getProductList();
        let shop = `<div class="shop"></div>`.toNode();
        if (productList) productList
            .forEach(product => shop.append(product.getPreviewNode()))
        this.#node = shop;
    }

    getNode() {
        return this.#node;
    }
}
