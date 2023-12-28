import {Component} from "../model/Component.js";
import {Requirement} from "../model/Requirement.js";

export class Nav extends Component {
    requirements = [
        Requirement.ofString(
            `<link rel="stylesheet" href="/furniture/css/nav.css">`
        ),
        Requirement.ofString(
            `<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Gelasio">`
        )
    ];

    #node = (`
        <nav class="nav">
            <div class="nav__selector"></div>
                <button class="nav__link" data-href="/about">About us</button>
                <button class="nav__link" data-href="/contact">Contact</button>
                <button class="nav__link" data-href="/shop">Shop</button>
        </nav>
    `).toNode();

    #removeInactive() {
        this.#node.querySelectorAll(".nav__link.inactive")
            .forEach(e =>
                e.classList.remove("inactive"));
    }

    async init(params) {
        super.init();
        const nav = this.#node;

        const selector = nav.querySelector(".nav__selector");
        const links = nav.querySelectorAll(".nav__link");

        this.select(params.endpoint)
        for (let i = 0; i < links.length; i++) {
            links[i].addEventListener("click", () => {
                selector.style.transform = `translateX(${Math.round(
                    i * (nav.offsetWidth + Math.min(nav.offsetWidth * .1, 36 / 2)) / links.length
                )}px)`;
                window.location.hash = links[i].dataset.href;
                this.#removeInactive();
                links[i].classList.add("inactive");
                selector.classList.remove("hidden");
            });
        }
    }

    select(href) {
        const links = this.#node.querySelectorAll(".nav__link");
        const selector = this.#node.querySelector(".nav__selector");

        let overlappingFound = false;
        for (let i = 0; i < links.length; i++) {
            if (links[i].dataset.href.match(`^.*${href}`)) {
                overlappingFound = true;
                selector.style.transform =
                    `translateX(calc(${i} * (100% + min(20%, 36px / 2))))`;
                this.#removeInactive();
                links[i].classList.add("inactive");
            }
        }
        if (!overlappingFound) {
            selector.classList.add("hidden");
            this.#removeInactive();
        } else {
            selector.classList.remove("hidden");
        }
    }

    getNode() {
        return this.#node;
    }
}
