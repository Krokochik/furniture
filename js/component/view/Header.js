import {Component} from "./Component.js";

export class Header extends Component {
    getNode() {
        return `<header>Header</header>`.toNode();
    }
}