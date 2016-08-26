export default class NotFilledPreferencesException {

    constructor(message) {
        this.message = message;
    }

    getMessage() {
        return this.message;
    }
}