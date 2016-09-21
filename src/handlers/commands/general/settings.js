'use strict';

import UserState from '../../../services/userState/userState.model'

export default class SettingsHandler {

    handle(message, bot) {
        var messageText = message.__('how_to_set_up');
        return UserState.findOne({'userId': message.from}).exec()
            .then(userState => {
                if (userState) {
                    messageText += '\n' + message.__('user_settings',
                        userState.language ? message.__(userState.language) : '-',
                        userState.city ? message.__(userState.city) : '-',
                        userState.currency ? message.__(userState.currency) : '-',
                        userState.operation ? message.__(userState.operation) : '-');
                } else {
                    messageText += '\n' + message.__('no_settings');
                }
                return bot.sendMessage(message.from, messageText, {parse_mode: 'Markdown'});
            });
    }
}