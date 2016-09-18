import Help from './commands/help';
import CitySelector from './commands/citySelector';
import CurrencySelector from './commands/currencySelector';
import OperationSelector from './commands/operationSelector';
import SetUp from './commands/setUp';
import Latest5Deals from './commands/deals/latest5Deals.js';
import LanguageSelector from './commands/languageSelector.js';
import FindDeals from './commands/deals/findDeals';

const DEFAULT_HANDLER_KEY = 'help';
export default class HandlerRouter {

  constructor() {
    var citySelectorHandler = new CitySelector();
    var currencySelectorHandler = new CurrencySelector();
    var operationSelectorHandler = new OperationSelector();
    var languageSelector = new LanguageSelector();

      this.handlers = {
      'help': new Help(),
      'city': citySelectorHandler,
      'currency': currencySelectorHandler,
      'operation': operationSelectorHandler,
      'setup': new SetUp(citySelectorHandler, currencySelectorHandler, operationSelectorHandler, languageSelector),
      'latest5' : new Latest5Deals(),
      'lang' : languageSelector,
      'findDeals' : new FindDeals()
    }
  }

  getCommandHandler(message) {
    var key = message.command;
    if (key.indexOf('/') == 0) {
      key = key.substr(1);
    }
    return this.handlers[key] || this.handlers[DEFAULT_HANDLER_KEY];
  }

  getCallbackQueryHandler(message) {
    var key = message.data;
    if (key.indexOf('_') > -1) {
      key = key.substr(0, key.indexOf('_'));
    }
    return this.handlers[key] || this.handlers[DEFAULT_HANDLER_KEY];
  }
}