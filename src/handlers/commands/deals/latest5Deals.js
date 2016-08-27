import Promise from 'bluebird';
import log from 'npmlog';

import NotFilledPreferencesException from '../../../lib/exception/NotFilledPreferencesException'
import DealsDataProvider from '../../../services/deals/dealsDataProvider'
import UserState from '../../../services/userState/userState.model'
import DealsMessageFormatter from '../../../services/deals/dealsMessageFormatter'

export default class Latest5DealsHandler {

    constructor() {
        this.dealsProvider = new DealsDataProvider();
        this.messageFormatter = new DealsMessageFormatter();
    }

    handle(message, bot) {
        UserState.findOne({'userId': message.from}).exec()
            .then(userState => {
                if (userState) {
                    return userState.userId;
                }
                return Promise.reject(new NotFilledPreferencesException('No user state found for user id: ' + message.from));
            })
            .then((userId) => {
                return this.dealsProvider.getLast5Deals(userId);
            })
            .then((deals) => {
                return bot.sendMessage(message.from,
                    this.messageFormatter.formatDeals(deals),
                    this.messageFormatter.getMessageOptions());
            })
            .catch((error) => {
                if (error instanceof NotFilledPreferencesException) {
                    log.verbose('', 'Got error %j', error);
                    bot.sendMessage(message.from, 'You should first set up your preferences. Type /help for more info.');
                } else {
                    console.error(error);
                    bot.sendMessage(message.from, 'Sorry we got error, please try later');
                }
            });
    }
}
