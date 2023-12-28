import {App} from "/furniture/js/component/App.js"
import {Router} from "/furniture/js/component/service/Router.js";

let app = new App();
app.liveRender = true;
new Router(app);
