export class LinkInterceptor {
    listener = (link, event) => {
        const href = link.dataset.href || link.getAttribute("href");
        if (href && href.match(/^\/|#/)) {
            event.preventDefault();
            window.location.hash = href;
        }
    };

    activate() {
        document.querySelectorAll("a, button").forEach(l =>
            l.addEventListener("click", e => this.listener(l, e))
        );
    }

    deactivate() {
        document.querySelectorAll("a, button").forEach(l =>
            l.removeEventListener("click", e => this.listener(l, e))
        );
    }
}