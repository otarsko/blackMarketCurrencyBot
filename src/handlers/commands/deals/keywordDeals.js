export default class KeywordDeals {

    constructor() {
        this.dealsProvider = new DealsDataProvider();
        this.messageFormatter = new DealsMessageFormatter();
        this.phoneNumberProvider = new DealPhoneNumberProvider();
    }
}