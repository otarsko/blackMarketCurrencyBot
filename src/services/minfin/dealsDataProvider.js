import MinfinUrlBuilder from '../../services/minfin/parsing/minfinUrlBuilder'
import MinfinParser from '../../services/minfin/parsing/minfinParser'
import UserState from '../../services/userState/userState.model'

export default class DealsDataProvider {

    constructor() {
        this.urlBuilder = new MinfinUrlBuilder();
        this.parser = new MinfinParser();
    }

    getDeals(userId) {
        return UserState.findOne({'userId': userId}).exec()
            .then((data) => {
                var url = this.urlBuilder.getUrl(data);
                return this.parser.getDeals(url);
            })
    }
}