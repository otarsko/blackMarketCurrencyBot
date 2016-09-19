'use strict';

import UserState from '../../../services/userState/userState.model'

export default class SettingsHandler {

    handle(message, bot) {
        var messageText = message.__('how_to_set_up');
        return UserState.findOne({'userId': message.from}).exec()
            .then(userState => {
                if (userState) {
                    messageText += '\n' + message.__('user_settings',
                        message.__(userState.language),
                        message.__(userState.city),
                        message.__(userState.currency),
                        message.__(userState.operation))
                } else {
                    messageText += '\n' + message.__('no_settings');
                }
                return bot.sendMessage(message.from, messageText, {parse_mode: 'Markdown'});
            });
    }
}