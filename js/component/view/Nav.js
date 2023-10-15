import {Component, Requirement} from "./Component.js";

export class Nav extends Component {
    requirements = [
        Requirement.ofString(
            `<link rel="stylesheet" href="/css/nav.css">`
        ),
        Requirement.ofString(
            `<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Gelasio">`
        )
    ];

    getNode() {
        let nav = `
            <nav class="nav">
                <div class="nav__selector"></div>
                <button class="nav__link" data-href="about">About us</button>
                <button class="nav__link" data-href="contact">Contact</button>
                <button class="nav__link" data-href="shop">Shop</button>
            </nav>
        `.toNode();

        let selector = nav.querySelector(".nav__selector");
        let links = nav.querySelectorAll(".nav__link");
        for (let i = 0; i < links.length; i++) {
            links[i].addEventListener("click", () => {
                selector.style.transform = `translateX(${Math.round(
                    i * (nav.offsetWidth + Math.min(nav.offsetWidth * .1, 36 / 2)) / links.length
                )}px)`;
                window.location.hash = links[i].dataset.href;
                nav.querySelectorAll(".nav__link.inactive")
                    .forEach(e =>
                        e.classList.remove("inactive"));
                links[i].classList.add("inactive");
            });
        }
        return nav;
    }
}