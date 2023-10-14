String.prototype.toNode = function() {
    const parser = new DOMParser();
    const temp = parser.parseFromString(this.toString(), 'text/html');
    return temp.body.firstChild || temp.head.firstChild;
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

    /**
     * Inits component's logic & elements
     * @return void
     **/
    init() {}

    /**
     * Returns node to be included in document
     * @return Node
     **/
    getNode() {}
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

    constructor(location, content) {
        this.location = location;
        this.content = content;
    }

    /**
     * Defines {@link Requirement.location} automatically
     * @param {Node} content
     * @return Requirement
     **/
    static ofNode(content) {
        let temp = document.createElement("div");
        temp.append(content);
        return this.ofString(temp.innerHTML);

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