export default {
    baseUrl: 'http://minfin.com.ua',
    blackMarketPath: '/currency/auction',
    currencyPath: {
        'usd': '/usd',
        'eur': '/eur'
    },
    actionPath: {
        'buy': '/buy',
        'sell': '/sell'
    },
    cityPath: { //todo: get from MongoDB
        'kharkiv': '/kharkov',
        'kyiv': '/kiev'
    }
}