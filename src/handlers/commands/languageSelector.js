import UserState from '../../services/userState/userState.model';

const COMMAND_PREFIX = 'language_';

function getLanguagesKeyboardOptions(callbackDataPrefix) { //todo: get from mongodb?
    callbackDataPrefix = callbackDataPrefix || '';
    return {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [
                    { text: 'English', callback_data: callbackDataPrefix + 'en' },
                    { text: 'Українська', callback_data: callbackDataPrefix + 'urk' },
                    { text: 'Русский', callback_data: callbackDataPrefix + 'ru' }
                ]
            ]
        })
    };
}

export default class LanguageSelector {

    handle(message, bot, callbackDataPrefix) {
        var parentHandlerPrefix = callbackDataPrefix || '';
        return bot.sendMessage(message.from,
            'Please select the language.',
            getLanguagesKeyboardOptions(parentHandlerPrefix + COMMAND_PREFIX));
    }

    handleCallbackQuery(message, bot, triggeredExternally) {
        var language = message.data.split('_')[1];

        return UserState.findOne({'userId': message.from}).exec()
            .then(UserState.updateUserState(message.from, {'language': language}))
            .then(userState => {
                return userState.save();
            })
            .then(() => {
                return bot.sendMessage(message.from, 'Language has been set successfully.')
            })
            .catch((err) => {
                console.error(err);
                if (!triggeredExternally) {
                    bot.sendMessage(message.from, 'Sorry, something went wrong. Try a bit later.'); //todo: copy-paste; return promise?
                }
                return new CommandException(err.message);
            });
    };
}