"use strict";
import CommandException from '../../lib/exception/commandException';

const COMMAND_PREFIX = 'setup_';

function triggerNextHandler(currentHandlerName, message, bot) {

    //If it is the last handler - just do nothing
    if (currentHandlerName === this.handlersFlow[this.handlersFlow.length - 1]) {
        return; //todo: what should be returned? Rejected promise?
    }

    var nextHandlerName;
    var indexOfCurrentHandler = this.handlersFlow.indexOf(currentHandlerName);
    if (indexOfCurrentHandler > -1 && (indexOfCurrentHandler + 1) < this.handlersFlow.length) {
        nextHandlerName = this.handlersFlow[indexOfCurrentHandler + 1];
    }
    nextHandlerName = nextHandlerName || this.handlersFlow[0];

    return this.setUpHandlers[nextHandlerName].handle(message, bot, COMMAND_PREFIX);
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
            return currentHandler.handleCallbackQuery(message, bot, true).then(data => {
                if (data && data instanceof CommandException) {
                    console.error('Can not handle message, got error.', message, data);
                    return bot.sendMessage(message.from, 'Sorry, something went wrong. Try a bit later.');
                } else {
                    return triggerNextHandler.call(this, currentHandlerName, message, bot);
                }
            });
        }

        //todo: what else should be returned? Rejected promise?
    };
}