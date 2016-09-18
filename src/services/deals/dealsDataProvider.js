import Promise from 'bluebird';
import log from 'npmlog';

import MinfinUrlBuilder from './minfin/parsing/minfinUrlBuilder';
import MinfinParser from './minfin/parsing/minfinParser';
import UserState from '../userState/userState.model';
import NotFilledPreferencesException from '../../lib/exception/NotFilledPreferencesException';
import IllegalArgumentsException from '../../lib/exception/illegalArgumentsException';
import CachedDeal from './cache/cachedDeal.model';

const DEALS_EXPIRATION_TIMEOUT = 1000 * 60 * 30; //30 mins

function checkIfCanProvideDeals(userState) {
    return userState && userState.operation && userState.city && userState.currency;
}

function checkIfNotExpired(cachedDeal) {
    var modelUpdateTime = cachedDeal.createdAt;

    var now = new Date();
    var timeDiff = Math.abs(modelUpdateTime - now.getTime());

    log.verbose('DealsDataProvider', 'Cached deal update time %s and now is %s. Time diff for deal is %s', modelUpdateTime.toString(), now.toString(), timeDiff);
    return timeDiff <= DEALS_EXPIRATION_TIMEOUT;
}

function getDeals(urlBuilder, parser, userState) {
    var url = urlBuilder.getUrl(userState);
    log.verbose('DealsDataProvider', 'Got url %s for user state %j', url, userState);

    if (url) {
        return CachedDeal.findOne({'url' : url}).exec()
            .then((cachedDeal) => {

                log.verbose('DealsDataProvider', 'Got cached deal %j for url %s', cachedDeal, url);
                if (cachedDeal && checkIfNotExpired(cachedDeal)) {

                    log.verbose('DealsDataProvider', 'Will return cached deal');
                    return cachedDeal.deals;
                } else {

                    log.verbose('DealsDataProvider', 'Got no cached deal to be returned');
                    return cacheAndGetDeals(parser, url, cachedDeal);
                }
            });
    } else {
        log.verbose('DealsDataProvider', 'Got NO url for user state %j', userState);
        return Promise.reject(new Error('Url was not build. Will not provide deals'));
    }
}

function cacheAndGetDeals(parser, url, cachedDeal) {
    log.verbose('DealsDataProvider', 'Will get deals and cache them for url %s', url);

    var removeCachedPromise;
    if (cachedDeal) {

        //done in this way, because we can not use updatedAt to track last deals update (because we are saving phone
        //numbers later and it's getting updated) so we need to force createdAt to be updated.
        log.verbose('DealsDataProvider', 'First we will remove already cached deals.');
        removeCachedPromise = cachedDeal.remove();
    } else {

        //just do nothing
        removeCachedPromise = Promise.resolve();
    }

    return removeCachedPromise
        .then(() => parser.getDeals(url))
        .then(deals => {
           if (deals) {
               log.verbose('DealsDataProvider', 'Got %s deals for url %s. Will cache them and return result', deals.length, url);

               log.verbose('DealsDataProvider', 'Will create new instance of cached deals');
               cachedDeal = new CachedDeal({
                   'url': url,
                   'deals': deals
               });

               return cachedDeal.save();
           }
        })
        .then(cachedDeals => {
            return cachedDeals.deals;
        });
}

function findDeals(userId, searchTerm, urlBuilder) {
    return UserState.findOne({'userId': userId}).exec()
        .then((userState) => {
            return urlBuilder.getUrl(userState);
        })
        .then(url => {
            return CachedDeal.findOne({'url' : url}).exec()
                .then((cachedDeal) => {

                });
        });
}

//todo: too many code there, should split
//todo: to many nested promises
export default class DealsDataProvider {

    constructor() {
        this.urlBuilder = new MinfinUrlBuilder();
        this.parser = new MinfinParser();
    }

    getDeals(userId) {
        log.verbose('DealsDataProvider', 'Getting deals for user %s', userId);

        return UserState.findOne({'userId': userId}).exec()
            .then((userState) => {
                log.verbose('DealsDataProvider', 'Found user state %j', userState);

                if (checkIfCanProvideDeals(userState)) {
                    log.verbose('DealsDataProvider', 'Can provide deals for user %s', userId);
                    return getDeals(this.urlBuilder, this.parser, userState);
                } else {
                    log.verbose('DealsDataProvider', 'Can NOT provide deals for user %s', userId);
                    return Promise.reject(new NotFilledPreferencesException('Can not provide deals. Missing preferences for user: ' + userId));
                }
            });
    }

    getLast5Deals(userId) {
        log.verbose('DealsDataProvider', 'Getting last 5 deals for user %s', userId);
        return this.getDeals(userId)
            .then(deals => {
                if (deals && deals.length > 5) {
                    return deals.slice(0, 5);
                } else {
                    return deals;
                }
            });
    }

    //todo: can not use mongodb full text search, because deals are stored as subdocument =/
    findDeals(userId, searchTerm) {
        log.verbose('DealsDataProvider', `Searching for deals for user ${userId} with keyword '${searchTerm}'`);
        if (!searchTerm || searchTerm.length < 3) {
            log.verbose('DealsDataProvider', `Keyword is empty or too short. Rejected.`);
            return Promise.reject(new IllegalArgumentsException('Keyword can not be less than 3 symbols'));
        }

        return this.getDeals(userId) //todo: rewrite. Currently call it to refresh cache if needed, but it is too ugly
            .then(deals => {
                if (deals.length > 0) {
                    return deals.filter(deal => {
                        return deal.message.match(new RegExp(`.*${searchTerm}.*`, 'i'));
                    });
                } else {
                    return deals;
                }
            })
    }
}