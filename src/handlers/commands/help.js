"use strict";

export default class HelpHandler {

    handle(message, bot) {
        return bot.sendMessage(message.from,
            message.__('about_bot') + '\n'
            + message.__('help_latest5') + '\n'
            + message.__('help_findDeals') + '\n'
            + message.__('help_setup') + '\n'
            + message.__('help_lang') + '\n'
            + message.__('help_city') + '\n'
            + message.__('help_currency') + '\n'
            + message.__('help_operation'));
    }
}