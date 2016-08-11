
function getCitiesKeyboardOptions() {
    return {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: 'City 1', callback_data: 'city_1' }],
                [{ text: 'City 2', callback_data: 'city_2' }],
                [{ text: 'City 3', callback_data: 'city_3' }]
            ]
        })
    };
}

export default class HelloHandler {
    constructor() {
    }

    handle(message, bot) {
        bot.sendMessage(message.from,
            'Please select the city you are interested in.',
            getCitiesKeyboardOptions());
    }

    handleCallbackQuery(message, bot) {
        bot.sendMessage(message.from,
            'City has been set successfully.');
    };
}