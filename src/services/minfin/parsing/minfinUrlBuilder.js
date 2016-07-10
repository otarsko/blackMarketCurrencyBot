import pathConstants from '../pathConstants'

export default class MinfinUrlBuilder {

    constructor() {}

    getUrl(userState) {
        var finalUrl = pathConstants.baseUrl + pathConstants.blackMarketPath;
        var userCurrency = userState.getCurrency();
        if (userCurrency && pathConstants.currencyPath[userCurrency]) {
            finalUrl += pathConstants.currencyPath[userCurrency];
        } else {
            console.error("Not valid currency set:", userCurrency);
            return;
        }

        var userCity = userState.getCity();
        if (userCity && pathConstants.cityPath[userCity]) {
            finalUrl += pathConstants.cityPath[userCity];
        } else {
            console.error("Not valid city set:", userCity);
            return;
        }

        var userOperation = userState.getOperation();
        if (userOperation && pathConstants.actionPath[userOperation]) {
            finalUrl += pathConstants.actionPath[userOperation];
        } else {
            console.error("Not valid city set:", userOperation);
            return;
        }

        return finalUrl;
    }
}