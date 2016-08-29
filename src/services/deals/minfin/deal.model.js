export default class Deal {

    constructor(bidId, rate, time, ammount, message, hiddenNumber) {
        this.bidId = bidId;
        this.rate = rate;
        this.time = time;
        this.ammount = ammount;
        this.message = message;
        this.hiddenNumber = hiddenNumber;
    }

    getBidId() {
        return this.bidId;
    }
    getTime() {
        return this.time;
    }
    getRate() {
        return this.rate;
    }
    getAmmount() {
        return this.ammount;
    }
    getMessage() {
        return this.message;
    }
    getHiddenNumber() {
        return this.hiddenNumber;
    }
    setNumber(number) {
        this.number = number;
    }
    getNumber() {
        return this.number;
    }
}