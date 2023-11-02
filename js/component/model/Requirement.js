import {Component} from "./Component.js";
import {Cipher} from "../service/Cipher.js";


String.prototype.hashCode = function() {
    let hash = 0,
        i, chr;
    if (this.length === 0) return hash;
    for (i = 0; i < this.length; i++) {
        chr = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0;
    }
    return hash;
}

/**
 * Functional interface for {@link Component.requirements}
 **/
export class Requirement {
    /**
     * Specifies where to place {@link Requirement.content}.
     * One of: `"head"`, `"body"`, `"app"` or a string query
     * @type string
     **/
    location;
    /**
     * An element to insert to the document e.g.
     * <link rel="stylesheet" href="style.css">
     * @type Node
     **/
    content;

    #hash;

    constructor(location, content) {
        this.location = location;
        this.content = content;
        this.#hash = "num_" + (location + content.outerHTML).hashCode();
    }

    get hash() {
        return this.#hash;
    }

    /**
     * Defines {@link Requirement.location} automatically
     * @param {Node} content
     * @return Requirement
     **/
    static ofNode(content) {
        return this.ofString(content.toString());
    }

    /**
     * Defines {@link Requirement.location} automatically
     * @param {string} content
     * @return Requirement
     **/
    static ofString(content) {
        const temp =
            new DOMParser().parseFromString(content.toString(), 'text/html');
        if (temp.head.firstChild) {
            return new Requirement("head", content.toNode());
        } else return new Requirement("body", content.toNode());
    }
}