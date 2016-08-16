"use strict";

const COMMAND_PREFIX = 'currency_'; //todo: move to another place?

function getCurrenciesKeyboardOptions(callbackDataPrefix) {
    callbackDataPrefix = callbackDataPrefix || '';
    return {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: 'USD', callback_data: callbackDataPrefix + 'usd' }],
                [{ text: 'EUR', callback_data: callbackDataPrefix + 'eur' }]
            ]
        })
    };
}

export default class CurrencyHandler {

    handle(message, bot, callbackDataPrefix) {
        bot.sendMessage(message.from,
            'Please select the currency you are interested in.',
            getCurrenciesKeyboardOptions(callbackDataPrefix + COMMAND_PREFIX));
    }

    handleCallbackQuery(message, bot) {
        bot.sendMessage(message.from,
            'Currency has been set successfully.');
    };
}