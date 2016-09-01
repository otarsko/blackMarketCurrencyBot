"use strict";
import CommandException from '../../lib/exception/commandException';
import UserState from '../../services/userState/userState.model';

const COMMAND_PREFIX = 'city_'; //todo: move to another place?

function getCitiesKeyboardOptions(callbackDataPrefix) { //todo: get from mongodb?
    return {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: 'Kharkiv', callback_data: callbackDataPrefix + 'kharkiv' }],
                [{ text: 'Kyiv', callback_data: callbackDataPrefix + 'kyiv' }]
            ]
        })
    };
}

export default class CitySelectorHandler {

    handle(message, bot, callbackDataPrefix) {
        var parentHandlerPrefix = callbackDataPrefix || '';
        return bot.sendMessage(message.from,
            'Please select the city you are interested in.',
            getCitiesKeyboardOptions(parentHandlerPrefix + COMMAND_PREFIX));
    }

    handleCallbackQuery(message, bot, triggeredExternally) {
        var city = message.data.split('_')[1];

        return UserState.findOne({'userId': message.from}).exec()
            .then(UserState.updateUserState(message.from, {'city': city}))
            .then(userState => {
                return userState.save();
            })
            .then(() => {
                return bot.sendMessage(message.from, 'City has been set successfully.')
            })
            .catch((err) => {
                console.error(err);
                if (!triggeredExternally) {
                    bot.sendMessage(message.from, 'Sorry, something went wrong. Try a bit later.'); //todo: copy-paste
                }
                return new CommandException(err.message);
            });
    };
}