"use strict";

const COMMAND_PREFIX = 'operation_'; //todo: move to another place?

function getOperationsKeyboardOptions(callbackDataPrefix) { //todo: get from mongodb?
    callbackDataPrefix = callbackDataPrefix || '';
    return {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: 'Buy', callback_data: callbackDataPrefix + 'buy' }],
                [{ text: 'Sell', callback_data: callbackDataPrefix + 'sell' }]
            ]
        })
    };
}

export default class OperationSelector {

    handle(message, bot, callbackDataPrefix) {
        bot.sendMessage(message.from,
            'Please select the operation you are interested in.',
            getOperationsKeyboardOptions(callbackDataPrefix + COMMAND_PREFIX));
    }

    handleCallbackQuery(message, bot) {
        bot.sendMessage(message.from,
            'Operation has been set successfully.');
    };
}