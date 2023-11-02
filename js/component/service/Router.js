import {Ad} from "../view/Ad.js";
import {Header} from "../view/Header.js";
import {Nav} from "../view/Nav.js";
import {Shop} from "../view/Shop.js";
import {ProductPage} from "../view/ProductPage.js";
import {LinkInterceptor} from "./LinkInterceptor.js";
import {Cart} from "../view/Cart.js";

export class Router {
    #components = {
        ad: new Ad(),
        header: new Header(),
        nav: new Nav(),
        shop: new Shop(),
        product: new ProductPage(),
        cart: new Cart()
    }

    #mappings = {
        shop: {
            endpoints: ["/shop", "/", "/main"],
            components: [
                this.#components.header,
                this.#components.nav,
                this.#components.ad,
                this.#components.shop
            ]
        },
        about: {
            endpoints: ["/about"],
            components: [
                this.#components.header,
                this.#components.nav
            ]
        },
        contact: {
            endpoints: ["/contact"],
            components: [
                this.#components.header,
                this.#components.nav
            ]
        },
        product: {
            endpoints: ["/product/{id}"],
            components: [
                this.#components.header,
                this.#components.nav,
                this.#components.product
            ]
        },
        cart: {
            endpoints: ["/cart"],
            components: [
                this.#components.header,
                this.#components.nav,
                this.#components.cart
            ]
        }
    }

    constructor(app) {
        if (!app) throw new TypeError(`App cannot be ${app}`);
        this.app = app;
        this.interceptor = new LinkInterceptor();

        document.addEventListener("load", e => this.#router(e));
        window.addEventListener("load", e => this.#router(e));
        window.addEventListener("hashchange", e => this.#router(e));
    }

    #processPath(template, path) {
        const result = {
            equals: true,
            variables: []
        };

        // /(^\/+)|(\/+$)/g equals to slashes at the end and start
        path = path.trim().replace(/(^\/+)|(\/+$)/g, "").split("/");
        template = template.trim().replace(/(^\/+)|(\/+$)/g, "").split("/");

        if (path.length > template.length) return Object.assign(
            result, {
                equals: false
            }
        );

        for (let i in template) {
            if (path[i] !== template[i]) {
                // is the current template piece a path variable e.g. /{variable name}/
                if (/^\{.*}$/.test(template[i])) {
                    result.equals = true;
                    result.variables.push({
                        name: template[i].substring(1, template[i].length - 1),
                        value: path[i]
                    })
                } else {
                    result.equals = false;
                    break;
                }
            }
        }

        return result;
    }

    /**
     * @param {Object} params Object to be given into each component's initializer
     * @param {Component} newComponents Target composition and placement of app's components
     **/
    async #setComponents(params, ...newComponents) {
        const indexOf = (obj, arr) => {
            for (let i in arr) {
                if (arr[i] && obj instanceof arr[i].constructor) {
                    return i;
                }
            }
            return -1;
        };

        const contains = (obj, arr) => {
            return indexOf(obj, arr) !== -1;
        };

        let oldComponents = this.app.components;
        for (let i = 0; i < oldComponents.length; i++) {
            const component = oldComponents[i];
            if (newComponents[i] === undefined || component !== newComponents[i]) {
                if (contains(component, newComponents)) {
                    const targetPos = indexOf(component, newComponents);
                    while (oldComponents.length <= targetPos) {
                        oldComponents.push(undefined);
                    }
                    oldComponents.splice(targetPos, 0, component);
                    i++;
                }
                if (component.getNode() && component.getNode().outerHTML)
                    component.getNode().outerHTML = ``;
                if (component.getNode() && component.getNode().innerHTML)
                    component.getNode().innerHTML = ``;
                oldComponents.splice(i--, 1);
            }
        }
        for (let i in newComponents) {
            if (!contains(newComponents[i], oldComponents)) {
                oldComponents.splice(i, 0, newComponents[i]);
                if (!contains(newComponents[i], oldComponents)) {
                    oldComponents.push(newComponents[i]);
                }
            }
        }

        this.app.importRequirements();
        await this.app.initComponents(params);
        this.app.loadComponentsToTree();
    }

    async #router(event) {
        if (!this.app.initialized) await this.app.init();

        const hash = location.hash
            .replaceAll(/(([#\/]){2,}|#)/g, "/")
            .replaceAll(/\/\//g, "");

        for (let key in this.#mappings) {
            for (let i in this.#mappings[key].endpoints) {
                const pathProcessingRes = this.#processPath(
                    this.#mappings[key].endpoints[i], hash
                );
                if (pathProcessingRes.equals) {
                    await this.#setComponents({
                        endpoint: this.#mappings[key].endpoints[0],
                        pathVariables: pathProcessingRes.variables
                    }, ...this.#mappings[key].components);
                }
            }
        }

        this.interceptor.activate();
    }
}