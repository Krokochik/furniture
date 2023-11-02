import {ShopService} from "./ShopService.js";
import {CartService} from "./CartService.js";

export class Bean {
    static shopService = new ShopService();
    static cartService = new CartService();
}