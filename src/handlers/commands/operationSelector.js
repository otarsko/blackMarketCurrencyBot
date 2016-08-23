"use strict";
import CommandException from '../../lib/exception/commandException';
import UserState from '../../services/userState/userState.model';

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
        var parentHandlerPrefix = callbackDataPrefix || '';
        return bot.sendMessage(message.from,
            'Please select the operation you are interested in.',
            getOperationsKeyboardOptions(parentHandlerPrefix + COMMAND_PREFIX));
    }

    //todo: almost the same as in other selectors. Refactor.
    handleCallbackQuery(message, bot, triggeredExternally) {
        var operation = message.data.split('_')[1];

        return UserState.findOne({'userId': message.from}).exec()
            .then(UserState.updateUserState(message.from, {'operation': operation}))
            .then(userState => {
                return userState.save();
            })
            .then(() => {
                return bot.sendMessage(message.from, 'Operation has been set successfully.')
            })
            .catch((err) => {
                if (!triggeredExternally) {
                    bot.sendMessage(message.from, 'Sorry, something went wrong. Try a bit later.'); //todo: copy-paste
                }
                return new CommandException(err.message);
            });
    };
}