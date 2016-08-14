import Help from './commands/help';
import CitySelector from './commands/citySelector';
import CurrencySelector from './commands/currencySelector';
import OperationSelector from './commands/operationSelector';
import SetUp from './commands/setUp';

const DEFAULT_NANDLER_KEY = 'help';
export default class HandlerRouter {

  constructor() {
    var citySelectorHandler = new CitySelector();
    var currencySelectorHandler = new CurrencySelector();
    var operationSelectorHandler = new OperationSelector();

    this.handlers = {
      'help': new Help(),
      'city': citySelectorHandler,
      'currency': currencySelectorHandler,
      'operation': operationSelectorHandler,
      'setup': new SetUp(citySelectorHandler, currencySelectorHandler, operationSelectorHandler)
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