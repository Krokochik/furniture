import {Component} from "./model/Component.js";
import {Requirement} from "./model/Requirement.js";
import {Bean} from "./service/Bean.js";

export class App extends Component {
    #requirements = [
        Requirement.ofString(
            `<meta charset="UTF-8">`
        ),
        Requirement.ofString(
            `<title>Furniture</title>`
        ),
        Requirement.ofString(
            `<link rel="stylesheet" href="/css/reset.css">`
        ),
        Requirement.ofString(
            `<link rel="stylesheet" href="/css/main.css">`
        )
    ];

    #htmlTree = {
        head: document.createElement("head"),
        body: document.createElement("body"),
        app: document.createElement("div")
    };

    #renderedTree = {};

    liveRender = false;

    /**
     * @type Component[]
     **/
    #components = [];

    /**
     * @param {Node} container
     * @param {boolean} liveRender
     **/
    constructor(container, liveRender) {
        super();
        if (!(container instanceof Node)) {
            if (!document.querySelector("body")) {
                document.appendChild(document.createElement("body"));
            }
            container = document.querySelector("body");
        }
        if (document.head.hasChildNodes()) this.#htmlTree.head = document.head;
        if (document.body.hasChildNodes()) this.#htmlTree.body = document.body;
        this.#htmlTree.app = Object.assign(
            document.createElement("div"), {
                className: "app"
            });
        if (liveRender) this.liveRender = true;
    }

    getNode() {
        return this.#htmlTree.app;
    }

    render() {
        if (this.liveRender) this.#renderedTree = this.#htmlTree;
        else {
            this.#renderedTree = {};
            for (let key in this.#htmlTree) {
                this.#renderedTree[key] = this.#htmlTree[key].cloneNode(true);
            }
        }
        document.body.remove();
        document.head.remove();
        document.querySelector("html")
            .append(this.#renderedTree.head, this.#renderedTree.body);
        document.body.prepend(this.#renderedTree.app);
    }

    loadComponentsToTree() {
        this.#components.forEach(component => {
            if (component && component.getNode()) {
                if (![...component.getNode().classList].includes(component.hash)) {
                    component.getNode().classList.add(component.hash);
                }
            }
        })

        for (let i in this.#components) {
            const component = this.#components[i];
            const app = this.#htmlTree.app;
            if (!component || !component.getNode()) continue;

            let child = app.querySelector(`.${component.hash}`);
            if (child !== null) {
                if (+Array.from(app.children).indexOf(child) !== +i) {
                    if (i < app.children.length) {
                        app.insertBefore(child, app.childNodes[i]);
                    }
                }
            } else {
                child = component.getNode();
                if (i >= app.children.length) {
                    app.appendChild(child);
                } else {
                    app.insertBefore(child, app.childNodes[i]);
                }
            }
        }
    }

    async initComponents(params) {
        for (let i in this.#components) {
            if (this.#components[i]) {
                await this.#components[i].init(params);
            }
        }
    }

    #clearImports() {
        document.querySelectorAll(`.requirement_${this.hash}`)
            .forEach(importation => importation.remove());
    }

    importRequirements() {
        let requirements = [...this.#requirements] || [];

        this.#components.forEach(component => {
            Array.prototype.push.apply(requirements, component.requirements);
        });

        // remove duplicates
        requirements.forEach(requirement => {
            let requirementDuplicates = false;
            let entries = 0;
            requirements.forEach(r => {
                if (requirement.location === r.location &&
                    requirement.content.outerHTML === r.content.outerHTML) {
                    if (++entries > 1) {
                        requirementDuplicates = true;
                    }
                }
            })
            if (requirementDuplicates) {
                requirements.splice(requirements.lastIndexOf(requirement), 1);
            }
        })

        requirements.forEach(requirement => {
            requirement.content.classList.add(`requirement_${this.hash}`)
            requirement.content.classList.add(requirement.hash)
        });

        if (requirements) {
            requirements.forEach(requirement => {
                if (!document.querySelector(`.${requirement.hash}`)) {
                    requirement.content.href = "/furniture/" + requirement.content.href;
                    switch (requirement.location) {
                        case "head":
                            this.#htmlTree.head.append(requirement.content.cloneNode(true));
                            break;
                        case "body":
                            this.#htmlTree.body.prepend(requirement.content.cloneNode(true));
                            break;
                        case "app":
                            this.#htmlTree.app.prepend(requirement.content.cloneNode(true));
                            break;
                        default:
                            if (document.querySelector(requirement.location)) {
                                document.querySelector(requirement.location)
                                    .prepend(requirement.content.cloneNode(true));
                            }
                    }
                }
            });
        }

        // remove unnecessary requirements from html
        document.querySelectorAll(`.requirement_${this.hash}`)
            .forEach(requirement => {
                requirement.classList.forEach(clazz => {
                    if (clazz.startsWith("num_") &&
                        clazz.split("_").length === 2 &&
                        !Number.isNaN(+clazz.split("_")[1])) {
                        let required = false;
                        requirements.forEach(r => {
                            if (r.content.classList.contains(clazz)) required = true;
                        })
                        if (!required) document.querySelectorAll(`.${clazz}`)
                            .forEach(el => el.remove())
                    }
                })
            })
    }

    set components(components) {
        this.#components = components;
    }

    /**
     * @param {Component} components
     **/
    async addComponents(...components) {
        components.forEach(component => {
            this.#components.push(component);
        });
        await this.initComponents();
        this.importRequirements();
        this.loadComponentsToTree();
    }

    /**
     * @param {Component} components
     **/
    async setComponents(...components) {
        this.#components = [];
        components.forEach(component => {
            this.#components.push(component);
        });
        await this.initComponents();
        this.#htmlTree.app.innerHTML = ``;
        this.loadComponentsToTree();
    }

    get components() {
        return this.#components;
    }

    async init(params) {
        super.init();
        this.importRequirements();
        this.render();
    }
}
