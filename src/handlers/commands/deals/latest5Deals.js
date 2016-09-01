'use strict';

import Promise from 'bluebird';
import log from 'npmlog';
import _ from 'lodash';

import NotFilledPreferencesException from '../../../lib/exception/NotFilledPreferencesException'
import DealsDataProvider from '../../../services/deals/dealsDataProvider'
import UserState from '../../../services/userState/userState.model'
import DealsMessageFormatter from '../../../services/deals/dealsMessageFormatter'
import DealPhoneNumberProvider from '../../../services/deals/dealPhoneNumberProvider'

const COMMAND_PREFIX = 'latest5_'; //todo: move to another place?

function getPhoneNumberSelectKeyboard(deals) {

    var buttons = [];
    deals.forEach((deal, index) => {
        buttons.push({
           text: '' + (index + 1),
           callback_data: `${COMMAND_PREFIX}${deal.bidId}`
       })
    });
    return {
        reply_markup: JSON.stringify({
            inline_keyboard: _.chunk(buttons, 3)
        })
    };
}

export default class Latest5DealsHandler {

    constructor() {
        this.dealsProvider = new DealsDataProvider();
        this.messageFormatter = new DealsMessageFormatter();
        this.phoneNumberProvider = new DealPhoneNumberProvider();
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
                var messageOptions = this.messageFormatter.getMessageOptions();
                _.merge(messageOptions, getPhoneNumberSelectKeyboard(deals));

                return bot.sendMessage(message.from,
                    this.messageFormatter.formatDeals(deals), messageOptions);
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

    /**
     * Returns phone number for requested deal.
     *
     * @param message
     * @param bot
     */
    handleCallbackQuery(message, bot) {
        log.verbose('Latest5DealsHandler', `Handling callback query with data ${message.data}`);
        var dealId = message.data.split('_')[1];

        this.phoneNumberProvider.getPhoneNumber(dealId)
            .then(phoneNumber => {
                return bot.sendMessage(message.from, `Phone number is ${phoneNumber}`);
            })
            .catch(error => {
                console.error(error);
                bot.sendMessage(message.from, 'Sorry we got error, please try later');
            })
    };
}
