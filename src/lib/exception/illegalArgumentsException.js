export default class IllegalArgumentsException {

    constructor(message) {
        this.message = message;
    }

    getMessage() {
        return this.message;
    }
}