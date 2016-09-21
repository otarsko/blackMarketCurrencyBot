"use strict";

import Promise from 'bluebird';
import log from 'npmlog';
import i18n from 'i18n';

import UserState from '../../services/userState/userState.model';

export default class I18n {

    init(message) {
        return UserState.findOne({'userId': message.from}).exec()
            .then(userState => {
                i18n.init(message);
                if (userState && userState.language) {
                    i18n.setLocale(message, userState.language);
                }
                return message;
            })
    }

    updateLanguage(message, language) {
        if (language) {
            i18n.setLocale(message, language);
        }
    }
}