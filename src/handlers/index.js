import Help from "./commands/help";
import CitySelector from "./commands/citySelector";

export default class HandlerRouter {

  constructor() {
    this.handlers = {
      "/help": new Help(),
      "/city": new CitySelector()
    }
  }

  getHandler(message) {
    return this.handlers[message.text] || this.handlers["/help"];
  }
}