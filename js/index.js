import {App} from "/js/component/App.js"
import {Router} from "/js/component/service/Router.js";

let app = new App();
app.liveRender = true;
new Router(app);