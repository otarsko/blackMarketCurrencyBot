"use strict";

import log from 'npmlog';
import emoji from 'node-emoji';

export default class StartHandler {

    handle(message, bot) {
        return bot.sendMessage(message.from, emoji.emojify('Wanna exchange :currency_exchange: your :dollar: or :euro: with nice rate? I will help you.\n\nType /help to know how to use me.'));
    }
}