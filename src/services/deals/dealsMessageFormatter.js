import he from 'he'

const MESSAGE_OPTIONS = {
    parse_mode: 'Markdown'
};

const MAX_CHARS_IN_MESSAGE = 4000; //todo: this value is specific to bot platform, so should be moved out

export default class DealsMessageFormatter {

    formatDeals(message, deals) {
        if (!deals || deals.length < 1) {
            return 'No deals found.';
        }

        var phoneNumberRequestMessage = '\n' + message.__('phone_number_request');
        var maxCharsPerMessage = (MAX_CHARS_IN_MESSAGE - phoneNumberRequestMessage.length) / deals.length;
        var text = '';
        deals.forEach((elem, index) => {
            var dealMessage = message.__('deal_time', index + 1, elem.time) + '\n'
                + message.__('deal_rate', he.decode(elem.rate)) + '\n'
                + message.__('deal_amount', he.decode(elem.ammount)) + '\n'
                + message.__('deal_message', he.decode(elem.message)) + '\n\n';

            if (dealMessage.length > maxCharsPerMessage) {
                dealMessage = dealMessage.substring(0, maxCharsPerMessage - 5) + '...\n\n';
            }
            text += dealMessage;
        });
        return text + phoneNumberRequestMessage;
    }

    //todo: return together with formatted deals?
    getMessageOptions() {
        return MESSAGE_OPTIONS;
    }
}