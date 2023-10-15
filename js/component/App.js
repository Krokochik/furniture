import {Component, Requirement} from "./view/Component.js";
import {Header} from "./view/Header.js";
import {Nav} from "./view/Nav.js";
import {Shop} from "./view/Shop.js";
import {Main} from "./view/Main.js";
import {Footer} from "./view/Footer.js";

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

    #loadComponentsToTree() {
        this.#components.forEach(component => {
            this.#htmlTree.app.append(component.getNode());
        })
    }

    #initComponents() {
        this.#components.forEach(component => {
            component.init();
        })
    }

    #clearImports() {
        document.querySelectorAll(`.requirement_${this.execHash}`)
            .forEach(importation => importation.remove());
    }

    #importRequirements() {
        let requirements = this.#requirements || [];
        this.#components.forEach(component => {
            Array.prototype.push.apply(requirements, component.requirements);
        });

        // remove duplicates
        requirements.forEach(requirement => {
            let requirementDuplicates = false;
            let entries = 0;
            requirements.forEach(r => {
                if (requirement.location === r.location &&
                    requirement.content.toString() === r.content.toString()) {
                    if (++entries > 1) {
                        requirementDuplicates = true;
                    }
                }
            })
            if (requirementDuplicates) {
                requirements.splice(requirements.lastIndexOf(requirement), 1);
            }
        })

        requirements.forEach(requirement =>
            requirement.content.classList.add(`requirement_${this.execHash}`)
        );

        if (requirements) {
            requirements.forEach(requirement => {
                switch (requirement.location) {
                    case "head":
                        this.#htmlTree.head.append(requirement.content);
                        break;
                    case "body":
                        this.#htmlTree.body.prepend(requirement.content);
                        break;
                    case "app":
                        this.#htmlTree.app.prepend(requirement.content);
                        break;
                    default:
                        if (document.querySelector(requirement.location)) {
                            document.querySelector(requirement.location)
                                .prepend(requirement.content);
                        }
                }
            });
        }

    }

    init() {
        let generateHash = () => {
            const array32 = new Uint32Array(8);
            crypto.getRandomValues(array32);
            return Array.from(array32, dec => ('0' + dec.toString(16)).slice(-2)).join('');
        }
        this.execHash = generateHash();


        this.#components.push(new Header(), new Nav(), new Shop());


        this.#clearImports();
        this.#importRequirements();
        this.#initComponents();
        this.#loadComponentsToTree();
        this.render();
    }
}