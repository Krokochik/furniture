import {Component} from "../model/Component.js";
import {Requirement} from "../model/Requirement.js";

export class Ad extends Component {
    requirements = [
        Requirement.ofString(
            `<link rel="stylesheet" href="/css/ad.css">`
        ),
        Requirement.ofString(
            `<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Gelasio">`
        )
    ];

    #node;

    async init(params) {
        super.init();
        this.#node = (`
            <a href="http://casino" target="_blank" class="ad-link">
                <div class="ad">
                    <span>Here could be your ad!</span>
                </div>
            </a>
        `).toNode();
    }

    getNode() {
        return this.#node;
    }
}