"use strict";
const COMMAND_PREFIX = 'setup_';

function triggerNextHandler(currentHandlerName, message, bot) {

    //If it is the last handler - just do nothing
    if (currentHandlerName === this.handlersFlow[this.handlersFlow.length - 1]) {
        return;
    }

    var nextHandlerName;
    var indexOfCurrentHandler = this.handlersFlow.indexOf(currentHandlerName);
    if (indexOfCurrentHandler > -1 && (indexOfCurrentHandler + 1) < this.handlersFlow.length) {
        nextHandlerName = this.handlersFlow[indexOfCurrentHandler + 1];
    }
    nextHandlerName = nextHandlerName || this.handlersFlow[0];

    this.setUpHandlers[nextHandlerName].handle(message, bot, COMMAND_PREFIX);
}

export default class SetUpHandler {
    constructor(citySelectorHandler, currencySelectorHandler, operationSelectorHandler) {
        this.setUpHandlers = {
            'city': citySelectorHandler,
            'currency': currencySelectorHandler,
            'operation': operationSelectorHandler
        };
        this.handlersFlow = ['city', 'currency', 'operation'];
    }

    handle(message, bot) {
        triggerNextHandler.call(this, undefined, message, bot);
    }

    handleCallbackQuery(message, bot) {
        message.data = message.data.replace(COMMAND_PREFIX, '');    //remove setUp prefix from data

        var currentHandlerName = message.data.split('_')[0];

        var currentHandler = this.setUpHandlers[currentHandlerName];
        if (currentHandler) {
            currentHandler.handleCallbackQuery(message, bot);
        }

        triggerNextHandler.call(this, currentHandlerName, message, bot);
    };
}