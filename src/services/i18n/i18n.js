import Promise from 'bluebird';
import log from 'npmlog';
import i18n from 'i18n';

import UserState from '../userState/userState.model';

const DEFAULT_LANGUAGE = "en";

export default class I18n {

    //todo: request MongoDB on each message? Not really nice.
    get(userId, messageKey) {
        return UserState.findOne({'userId': userId}).exec()
            .then(userState => {
                if (userState && userState.language) {
                    return userId.language
                } else {
                    return Promise.reject(new Error('No language found in user preferences'))
                }
            })
            .catch(err => {
                log.verbose('I18n', `No language found for user ${userId}. Will use default - ${DEFAULT_LANGUAGE}`);
                return DEFAULT_LANGUAGE;
            })
            .then(language => {
                return i18n.__(messageKey);
            })
    }
}