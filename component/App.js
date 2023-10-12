import {Component} from "/component/Component.js";

export class App extends Component {
    #htmlTree = {
        head: document.createElement("head"),
        body: document.createElement("body"),
        app: document.createElement("div")
    };

    /**
     * @type Component[]
     **/
    #appTree = [];

    constructor(container) {
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
    }

    getNode() {
        return this.#htmlTree.app;
    }

    #rerender() {
        document.body.remove();
        document.head.remove();
        document.querySelector("html")
            .append(this.#htmlTree.head, this.#htmlTree.body);
        this.#htmlTree.app.innerHTML = "";
        this.#appTree.forEach(element => {
            this.#htmlTree.app.append(element.getNode());
        });
        document.body.prepend(this.#htmlTree.app);
    }

    init() {
        this.#rerender();
    }
}