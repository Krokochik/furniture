String.prototype.toNode = function() {
    const parser = new DOMParser();
    const temp = parser.parseFromString(this.toString(), 'text/html');
    return temp.body.firstChild || temp.head.firstChild;
}

Node.prototype.toString = function () {
    let temp = document.createElement("div");
    temp.append(this);
    return temp.innerHTML;
}

/**
 * The interface describing that the class
 * could be loaded as an app's component
 **/
export class Component {
    /**
     * Specifies what is significant to load with component
     * @type Requirement[]
     **/
    requirements;
    #initialized = false;
    #node;

    constructor(props) {
        this.hash = this.generateHash();
    }


    /**
     * Inits component's logic & elements
     * @param {Object} params
     * @return void
     **/
    async init(params) {
        this.#initialized = true;
    }

    get initialized() {
        return this.#initialized;
    }

    /**
     * Returns node to be included in document
     * @return Node
     **/
    getNode() {

    }

    /**
     * Generates a unique string to be used as run marker
     * @return {string}
     **/
    generateHash() {
        const array32 = new Uint32Array(8);
        crypto.getRandomValues(array32);
        const hexArray = Array.from(array32, dec => ("0" + dec.toString(16)).slice(-2)).join("");
        return this.constructor.name.toLowerCase() + "_" + hexArray;
    }
}