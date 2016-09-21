"use strict";

import log from 'npmlog';

import CommandException from '../../lib/exception/commandException';
import UserState from '../../services/userState/userState.model';
import I18n from '../../services/i18n/i18n';

const COMMAND_PREFIX = 'lang_';

function getLanguagesKeyboardOptions(callbackDataPrefix) { //todo: get from mongodb?
    callbackDataPrefix = callbackDataPrefix || '';
    return {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [
                    { text: 'English', callback_data: callbackDataPrefix + 'en' },
                    { text: 'Українська', callback_data: callbackDataPrefix + 'ukr' },
                    { text: 'Русский', callback_data: callbackDataPrefix + 'ru' }
                ]
            ]
        })
    };
}

export default class LanguageSelector {

    constructor() {
        this.i18n = new I18n();
    }

    handle(message, bot, callbackDataPrefix) {
        var parentHandlerPrefix = callbackDataPrefix || '';
        return bot.sendMessage(message.from,
            message.__('select_language'),
            getLanguagesKeyboardOptions(parentHandlerPrefix + COMMAND_PREFIX));
    }

    handleCallbackQuery(message, bot, triggeredExternally) {
        var language = message.data.split('_')[1];

        var userId = message.from;
        return UserState.findOne({'userId': userId}).exec()
            .then(UserState.updateUserState(userId, {'language': language}))
            .then(userState => {
                return userState.save()
                    .return(userState.language);
            })
            .then((newLanguage) => {
                this.i18n.updateLanguage(message, newLanguage);
                return bot.sendMessage(message.from, message.__('language_changed'))
            })
            .catch((err) => {
                log.error('LanguageSelector', err);
                if (!triggeredExternally) {
                    bot.sendMessage(message.from, message.__('bot_error')); //todo: copy-paste; return promise?
                }
                return new CommandException(err.message);
            });
    };
}