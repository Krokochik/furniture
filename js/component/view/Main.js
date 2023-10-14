import {Component, Requirement} from "./Component.js";

export class Main extends Component {
    requirements = [
        Requirement.ofString(
            `<link rel="stylesheet" href="abracadabra">`
        )
    ];

    getNode() {
        return `<main>Main</main>`.toNode();
    }
}