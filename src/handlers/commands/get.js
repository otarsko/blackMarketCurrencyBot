import he from 'he'
import DealsDataProvider from '../../services/minfin/dealsDataProvider'

export default class HandlerRouter {

    constructor() {
        this.dealsProvider = new DealsDataProvider();
    }

    handle(message, bot) {
        this.dealsProvider.getDeals(message.from)
            .then((deals) => {
                return bot.sendMessage(message.from, he.decode(deals[0].message));
            })
            .catch((error) => {
                console.error(error);
                bot.sendMessage(message.from, 'Sorry we got error, please try later');
            });
    }
}
