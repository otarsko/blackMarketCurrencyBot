export default class HelpHandler {
    constructor() {}

    handle(message, bot) {
        bot.sendMessage(message.from, `Call /setup to set city/currency/operation you are interested in!`);
    }
}