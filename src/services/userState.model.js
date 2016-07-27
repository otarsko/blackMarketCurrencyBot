export default class UserState {

    constructor() {
        this.defaultOperation = "buy";
        this.defaultCity = "kharkiv";
        this.defaultCurrency = "usd";
    }

    getOperation() {
        return this.defaultOperation;
    }

    getCity() {
        return this.defaultCity;
    }

    getCurrency() {
        return this.defaultCurrency;
    }
}