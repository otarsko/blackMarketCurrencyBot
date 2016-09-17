"use strict";
import CommandException from '../../lib/exception/commandException';
import UserState from '../../services/userState/userState.model';

const COMMAND_PREFIX = 'operation_'; //todo: move to another place?

function getOperationsKeyboardOptions(message, callbackDataPrefix) { //todo: get from mongodb?
    callbackDataPrefix = callbackDataPrefix || '';
    return {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [
                    { text: message.__('buy'), callback_data: callbackDataPrefix + 'buy' },
                    { text: message.__('sell'), callback_data: callbackDataPrefix + 'sell' }
                ]
            ]
        })
    };
}

export default class OperationSelector {

    handle(message, bot, callbackDataPrefix) {
        var parentHandlerPrefix = callbackDataPrefix || '';
        return bot.sendMessage(message.from,
            message.__('select_operation'),
            getOperationsKeyboardOptions(message, parentHandlerPrefix + COMMAND_PREFIX));
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
                return bot.sendMessage(message.from, message.__('operation_changed'))
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