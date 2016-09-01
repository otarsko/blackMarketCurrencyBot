export default class HelpHandler {

    handle(message, bot) {
        return bot.sendMessage(message.from,
            'Call /get to get 5 latest deals\n'
            + 'Call /setup to set city/currency/operation you are interested in!\n'
            + 'Call /city to set/change city.\n'
            + 'Call /currency to set/change currency.\n'
            + 'Call /operation to set/change currency.');
    }
}