import he from 'he'

const MESSAGE_OPTIONS = {
    parse_mode: 'Markdown'
};

const MAX_CHARS_IN_MESSAGE = 4000; //todo: this value is specific to bot platform, so should be moved out

export default class DealsMessageFormatter {

    formatDeals(deals) {
        if (!deals || deals.length < 1) {
            return 'No deals found.';
        }

        var phoneNumberRequestMessage = '\nTo get phone number please use keyboard bellow.';
        var maxCharsPerMessage = (MAX_CHARS_IN_MESSAGE - phoneNumberRequestMessage.length) / deals.length;
        var message = '';
        deals.forEach((elem, index) => {
            var dealMessage = `\`${index + 1}\`*Time posted*: ${elem.time}\n*Rate*: ${he.decode(elem.rate)}\n`
                + `*Amount*: ${he.decode(elem.ammount)}\n*Message*: ${he.decode(elem.message)}\n\n`;
            if (dealMessage.length > maxCharsPerMessage) {
                dealMessage = dealMessage.substring(0, maxCharsPerMessage - 5) + '...\n\n';
            }
            message += dealMessage;
        });
        return message + phoneNumberRequestMessage;
    }

    //todo: return together with formatted deals?
    getMessageOptions() {
        return MESSAGE_OPTIONS;
    }
}