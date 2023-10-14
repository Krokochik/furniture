import {Component} from "./Component.js";

export class Footer extends Component {
    getNode() {
        return `<footer>Footer</footer>`.toNode();
    }
}