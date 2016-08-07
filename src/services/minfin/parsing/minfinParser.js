import Request from 'request';
import Cheerio from 'cheerio';
import Deal from '../deal.model';

export default class MinfinParser {

    constructor() {
        this.cheerio = new Cheerio();
    }

    //todo: move class names to separate config, use callback, implement
    getDeals(url, callback) {
        if (!url) {
            console.error("Got undefined url");
            callback([]);
            return;
        }
        new Request(url, function (err, resp, body) {
            var $ = Cheerio.load(body);
            var deals = [];
            $('.js-au-deal').each(function(i, elem) {
                var bidId = $(elem).data("bid");
                var rate = $(elem).find(".au-deal-currency") && ($(elem).find(".au-deal-currency").html() || 0);
                if (rate && bidId) {
                    var time = $(elem).find(".au-deal-time").html();
                    var sum = $(elem).find(".au-deal-sum").html();
                    var message = $(elem).find(".js-au-msg-wrapper").html();
                    deals.push(new Deal(bidId, rate, time, sum, message));
                }
            });
            if (deals.length === 0) {
                console.error("No deals found for url: " + url);
            }
            callback(deals);
        });
    }
}