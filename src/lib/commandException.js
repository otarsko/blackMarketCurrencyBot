export default class CommandException {

    constructor(message) {
        this.message = message;
    }

    getMessage() {
        return this.message;
    }
}