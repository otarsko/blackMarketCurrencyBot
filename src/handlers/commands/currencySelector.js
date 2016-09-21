"use strict";
import CommandException from '../../lib/exception/commandException';
import UserState from '../../services/userState/userState.model';

const COMMAND_PREFIX = 'currency_'; //todo: move to another place?

function getCurrenciesKeyboardOptions(callbackDataPrefix) { //todo: get from mongodb?
    callbackDataPrefix = callbackDataPrefix || '';
    return {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [
                    { text: 'USD', callback_data: callbackDataPrefix + 'usd' },
                    { text: 'EUR', callback_data: callbackDataPrefix + 'eur' }
                ]
            ]
        })
    };
}

export default class CurrencyHandler {

    handle(message, bot, callbackDataPrefix) {
        var parentHandlerPrefix = callbackDataPrefix || '';
        return bot.sendMessage(message.from,
            message.__('select_currency'),
            getCurrenciesKeyboardOptions(parentHandlerPrefix + COMMAND_PREFIX));
    }

    //todo: almost the same as in other selectors. Refactor.
    handleCallbackQuery(message, bot, triggeredExternally) {
        var currency = message.data.split('_')[1];

        return UserState.findOne({'userId': message.from}).exec()
            .then(UserState.updateUserState(message.from, {'currency': currency}))
            .then(userState => {
                return userState.save();
            })
            .then(() => {
                return bot.sendMessage(message.from, message.__('currency_changed'))
            })
            .catch((err) => {
                console.error(err);
                if (!triggeredExternally) {
                    bot.sendMessage(message.from, message.__('bot_error')); //todo: copy-paste
                }
                return new CommandException(err.message);
            });
    };
}