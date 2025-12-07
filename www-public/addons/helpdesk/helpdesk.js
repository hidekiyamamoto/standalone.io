import {AddonInterface,ModelInterface} from "../newdoo-addon.js";
import {HELPDESK_TICKET} from "./helpdesk-ticket.js";
var addon=new AddonInterface('helpdesk');
addon.models.push(HELPDESK_TICKET);
//addon.menu.push();
export {addon}