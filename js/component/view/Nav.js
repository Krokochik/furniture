import {Component} from "./Component.js";

export class Nav extends Component {
    getNode() {
        return `<nav>Nav</nav>`.toNode();
    }
}