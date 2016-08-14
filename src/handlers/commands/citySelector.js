
function getCitiesKeyboardOptions(callbackDataPrefix) {
    return {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: 'Kiev', callback_data: callbackDataPrefix + 'city_1' }],
                [{ text: 'Kharkiv', callback_data: callbackDataPrefix + 'city_2' }],
                [{ text: 'Dnipro', callback_data: callbackDataPrefix + 'city_3' }]
            ]
        })
    };
}

export default class HelloHandler {
    constructor() {
    }

    handle(message, bot, callbackDataPrefix) {
        bot.sendMessage(message.from,
            'Please select the city you are interested in.',
            getCitiesKeyboardOptions(callbackDataPrefix));
    }

    handleCallbackQuery(message, bot) {
        bot.sendMessage(message.from,
            'City has been set successfully.');
    };
}