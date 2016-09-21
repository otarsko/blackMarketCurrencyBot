'use strict';

import log from 'npmlog';
import _ from 'lodash';

import NotFilledPreferencesException from '../../../lib/exception/NotFilledPreferencesException';
import IllegalArgumentsException from '../../../lib/exception/illegalArgumentsException';
import DealsDataProvider from '../../../services/deals/dealsDataProvider';
import DealsMessageFormatter from '../../../services/deals/dealsMessageFormatter';
import DealPhoneNumberProvider from '../../../services/deals/dealPhoneNumberProvider';

const COMMAND_PREFIX = 'findDeals_'; //todo: move to another place?

//todo: remove copy-paste stuff
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

export default class FindDeals {

    constructor() {
        this.dealsProvider = new DealsDataProvider();
        this.messageFormatter = new DealsMessageFormatter();
        this.phoneNumberProvider = new DealPhoneNumberProvider();
    }

    handle(message, bot) {
        return this.dealsProvider.findDeals(message.from, message.options)
            .then((deals) => {
                if (deals.length > 0) {
                    var messageOptions = this.messageFormatter.getMessageOptions();
                    _.merge(messageOptions, getPhoneNumberSelectKeyboard(deals));

                    return bot.sendMessage(message.from,
                        this.messageFormatter.formatDeals(message, deals), messageOptions);
                } else {
                    return bot.sendMessage(message.from, message.__('no_deals'));
                }
            })
            .catch((error) => {
                if (error instanceof NotFilledPreferencesException) {
                    log.verbose('Latest5DealsHandler', 'Got error %j', error);
                    bot.sendMessage(message.from, message.__('error_setup_account'));
                } else if (error instanceof IllegalArgumentsException) {
                    log.verbose('Latest5DealsHandler', 'Got error %j', error);
                    bot.sendMessage(message.from, message.__(error.getMessage()));
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
    //todo: copy-pasted
    handleCallbackQuery(message, bot) {
        log.verbose('KeywordDeals', `Handling callback query with data ${message.data}`);
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