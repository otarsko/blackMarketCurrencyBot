import he from 'he'
import MinfinUrlBuilder from '../../services/minfin/parsing/minfinUrlBuilder'
import MinfinParser from '../../services/minfin/parsing/minfinParser'
import UserState from '../../services/userState/userState.model'

//create separate service with one get method instead of doing stuff there
export default class HandlerRouter {

    constructor() {
        this.urlBuilder = new MinfinUrlBuilder();
        this.parser = new MinfinParser();
    }

    handle(message, bot) {
        return UserState.findOne({'userId': message.from}).exec()
            .then((data) => {
                var url = this.urlBuilder.getUrl(data);
                this.parser.getDeals(url, (deals) => {
                    bot.sendMessage(message.from, he.decode(deals[0].message));
                });
            })
            .catch((error) => {
                console.error(error);
                bot.sendMessage(message.from, 'Sorry we got error, please try later');
            });
    }
}
