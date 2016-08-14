
function getCurrenciesKeyboardOptions(callbackDataPrefix) {
    callbackDataPrefix = callbackDataPrefix || '';
    return {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: 'curr 1', callback_data: callbackDataPrefix + 'currency_1' }],
                [{ text: 'curr 2', callback_data: callbackDataPrefix + 'currency_2' }],
                [{ text: 'curr 3', callback_data: callbackDataPrefix + 'currency_3' }]
            ]
        })
    };
}

export default class CurrencyHandler {

    handle(message, bot, callbackDataPrefix) {
        bot.sendMessage(message.from,
            'Please select the currency you are interested in.',
            getCurrenciesKeyboardOptions(callbackDataPrefix));
    }

    handleCallbackQuery(message, bot) {
        bot.sendMessage(message.from,
            'Currency has been set successfully.');
    };
}