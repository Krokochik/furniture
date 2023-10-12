/**
 * The interface describing that the class
 * could be loaded as an app's component.
 **/
export class Component {
    /**
     * <strong>Specifies what is significant to load with component.</strong>
     * <br>
     * Requirement must contain:
     *   - location (query for doc e.g. `"head"`)
     *   - content (a string to insert e.g. `<link rel="stylesheet" href="style.css">`)
     * @private
     * @type Object[]
     **/
    requirements = [];

    /**
     * Sets if requirement could be relocated if needed.
     * If false, requirement shoulda be ignored if smth went
     * wrong. Importer's trynna include it to another place otherwise.
     * @private
     **/
    requirementFlow = false;

    /**
     * Inits component's logic & elements.
     * @return void
     **/
    init() {}

    /**
     * Returns node to be included in document.
     * @return Node
     **/
    getNode() {}

    /**
     * Returns an object consisting of:
     *   - flow: {@link Component.requirementFlow}
     *   - list: {@link Component.requirements}
     **/
    getRequirements() {
        return {
            flow: this.requirementFlow,
            list: this.requirements
        };
    }
}