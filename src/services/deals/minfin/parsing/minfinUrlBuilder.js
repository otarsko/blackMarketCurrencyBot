import pathConstants from '../pathConstants'

export default class MinfinUrlBuilder {

    constructor() {}

    getUrl(userState) {
        var finalUrl = pathConstants.baseUrl + pathConstants.blackMarketPath;
        var userCurrency = userState.currency;
        if (userCurrency && pathConstants.currencyPath[userCurrency]) {
            finalUrl += pathConstants.currencyPath[userCurrency];
        } else {
            console.error("Not valid currency set:", userCurrency);
            return;
        }

        var userOperation = userState.operation;
        if (userOperation && pathConstants.actionPath[userOperation]) {
            finalUrl += pathConstants.actionPath[userOperation];
        } else {
            console.error("Not valid city set:", userOperation);
            return;
        }

        var userCity = userState.city;
        if (userCity && pathConstants.cityPath[userCity]) {
            finalUrl += pathConstants.cityPath[userCity];
        } else {
            console.error("Not valid city set:", userCity);
            return;
        }

        return finalUrl;
    }
}