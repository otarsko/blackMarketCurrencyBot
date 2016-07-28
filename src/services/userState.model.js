export default class UserState {

    constructor(operation, city, currency) {
        this.operation = operation;
        this.city = city;
        this.currency = currency;
    }

    getOperation() {
        return this.operation;
    }

    getCity() {
        return this.city;
    }

    getCurrency() {
        return this.currency;
    }
}