import Request from 'request';
import Cheerio from 'cheerio';
import stripTags from 'striptags';
import removeNewline from 'newline-remove';
import condenseWhitespace from 'condense-whitespace';
import agents from 'fake-user-agent';
import Promise from 'bluebird';
import RequestPromise from 'request-promise';
import log from 'npmlog';

import Deal from '../deal.model'; //todo: do I need this model at all?

export default class MinfinParser {

    //todo: move class names to separate config, use callback, implement
    getDeals(url) {
        if (!url) {
            console.error("Got undefined url");
            return Promise.reject(new Error('Undefined url'));
        }

        var options = {
            url: url,
            headers: {
                'User-Agent': agents.IE9
            },
            transform: (body) => {
                return Cheerio.load(body);
            }
        };
        return new RequestPromise(options).then($ => {
            var deals = [];
            $('.js-au-deal').each(function(i, elem) {
                var bidId = $(elem).data("bid");
                var rate = $(elem).find(".au-deal-currency") && ($(elem).find(".au-deal-currency").html() || 0);
                if (rate && bidId) {
                    var time = $(elem).find(".au-deal-time").html();

                    var sum = $(elem).find(".au-deal-sum").html();
                    sum = stripTags(sum);

                    var message = $(elem).find(".js-au-msg-wrapper").html();
                    message = condenseWhitespace(removeNewline(message));

                    var hiddenNumber = $(elem).find(".au-dealer-phone").html();
                    hiddenNumber = condenseWhitespace(removeNewline(stripTags(hiddenNumber)));

                    deals.push(new Deal(bidId, rate, time, sum, message, hiddenNumber));
                }
            });
            if (deals.length === 0) {
                console.error("No deals found for url: " + url);
                return Promise.reject(new Error('No deals found'));
            }
            return deals;
        });
    }

    getMissingPhoneNumberPart(dealId) {
        var dealIdNumber = parseInt(dealId);
        log.verbose('MinfinParser', `Getting missing phone number part for deal with id ${dealIdNumber}`);
        var options = {
            url: `http://minfin.com.ua/modules/connector/connector.php?action=auction-get-contacts&bid=${dealIdNumber + 1}&r=true`,
            headers: {
                'User-Agent': agents.IE9,
                'Referer': 'http://minfin.com.ua',
                'Accept-Language': 'en-US,en;q=0.8',
                'Cookie': 'minfincomua_region=57'
            },
            method: 'POST',
            form: {
                'bid': dealIdNumber,
                'action': 'auction-get-contacts',
                'r': true
            },
            json: true,
            gzip: true
        };

        return new RequestPromise(options).then(body => {
            log.verbose('MinfinParser', `Number request. Got response %j`, body);
            if (body && body.message === "OK") {
                return body.data;
            }
            return undefined;
        });
    }
}