import {Component} from "../model/Component.js";
import {Requirement} from "../model/Requirement.js";
import {ShopService} from "../service/ShopService.js";
import {Bean} from "../service/Bean.js";

export class ProductPage extends Component {
    requirements = [
        Requirement.ofString(
            `<link rel="stylesheet" href="/css/product.css">`
        ),
        Requirement.ofString(
            `<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Nunito+Sans">`
        )
    ];

    #node;

    async init(params) {
        super.init();
        let id;
        for (const i in params.pathVariables) {
            if (params.pathVariables[i].name === "id") {
                id = +params.pathVariables[i].value;
            }
        }
        if (id || id === 0) {
            const product = await Bean.shopService.getProduct(id);
            this.#node = product.getNode();
        }
    }

    getNode() {
        return this.#node;
    }
}