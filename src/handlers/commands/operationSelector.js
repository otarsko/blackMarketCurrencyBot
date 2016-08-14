
function getOperationsKeyboardOptions(callbackDataPrefix) {
    callbackDataPrefix = callbackDataPrefix || '';
    return {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: 'op 1', callback_data: callbackDataPrefix + 'operation_1' }],
                [{ text: 'op 2', callback_data: callbackDataPrefix + 'operation_2' }]
            ]
        })
    };
}

export default class OperationSelector {

    handle(message, bot, callbackDataPrefix) {
        bot.sendMessage(message.from,
            'Please select the operation you are interested in.',
            getOperationsKeyboardOptions(callbackDataPrefix));
    }

    handleCallbackQuery(message, bot) {
        bot.sendMessage(message.from,
            'Operation has been set successfully.');
    };
}