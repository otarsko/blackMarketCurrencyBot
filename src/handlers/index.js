import Help from './commands/help';
import CitySelector from './commands/citySelector';

const DEFAULT_NANDLER_KEY = 'help';
export default class HandlerRouter {

  constructor() {
    this.handlers = {
      'help': new Help(),
      'city': new CitySelector()
    }
  }

  getCommandHandler(message) {
    var key = message.text;
    if (key.indexOf('/') == 0) {
      key = key.substr(1);
    }
    return this.handlers[key] || this.handlers[DEFAULT_NANDLER_KEY];
  }

  getCallbackQueryHandler(message) {
    var key = message.data;
    if (key.indexOf('_') > -1) {
      key = key.substr(0, key.indexOf('_'));
    }
    return this.handlers[key] || this.handlers[DEFAULT_NANDLER_KEY];
  }
}