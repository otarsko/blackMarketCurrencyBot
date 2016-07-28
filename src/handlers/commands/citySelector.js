export default class HelloHandler {
    constructor() {}

    handle(message, bot) {
        bot.sendMessage(message.from, `Hi, there! It is nice to see you here, ${message.user.firstName}!`);
    }
}