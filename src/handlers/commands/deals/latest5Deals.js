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
        return this.dealsProvider.getLast5Deals(message.from)
            .then((deals) => {
                var messageOptions = this.messageFormatter.getMessageOptions();
                _.merge(messageOptions, getPhoneNumberSelectKeyboard(deals));

                return bot.sendMessage(message.from,
                    this.messageFormatter.formatDeals(message, deals), messageOptions);
            })
            .catch((error) => {
                if (error instanceof NotFilledPreferencesException) {
                    log.verbose('Latest5DealsHandler', 'Got error %j', error);
                    bot.sendMessage(message.from, message.__('error_setup_account'));
                } else {
                    log.error('Latest5DealsHandler', 'Got error %j', error);
                    bot.sendMessage(message.from, message.__('bot_error'));
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
                return bot.sendMessage(message.from, message.__('phone_number', phoneNumber));
            })
            .catch(error => {
                console.error(error);
                bot.sendMessage(message.from, message.__('bot_error'));
            })
    };
}
