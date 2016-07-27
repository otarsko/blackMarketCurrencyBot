export default class HelpHandler {
    constructor() {}

    handle(message, bot) {
        bot.sendMessage(message.from, `Call /hello for greetings!`);
    }
}