export default class Deal {

    constructor(bidId, rate, time, ammount, message) {
        this.bidId = bidId;
        this.rate = rate;
        this.time = time;
        this.ammount = ammount;
        this.message = message;
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
}