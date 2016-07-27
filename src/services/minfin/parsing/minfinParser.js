import Request from 'request';
import Cheerio from 'cheerio';

export default class MinfinParser {

    constructor() {
        this.request = new Request();
        this.cheerio = new Cheerio();
    }

    //todo: move class names to separate config, use callback, implement
    getDeals(url, callback) {
        request(url, function(err, resp, body) {
            var $ = cheerio.load(body);
            var dealsEntries = $('.js-au-deal');
        });
    }
}