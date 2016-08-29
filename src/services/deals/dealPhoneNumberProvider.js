import Promise from 'bluebird';
import log from 'npmlog';
import he from 'he'

import CachedDeal from './cache/cachedDeal.model';
import MinfinParser from './minfin/parsing/minfinParser';

function validateCachedDeal(dealId, cachedDeal) {
    log.verbose('DealPhoneNumberProvider', 'Validating cached deal.');
    if(!cachedDeal) {

        //todo: in future it would be possible to requery data
        return Promise.reject(new Error(`Found no cached deal for deal id ${dealId}, can not proceed.`));
    }
    return cachedDeal;
}

function validateMissingNumberPart(dealId, missingNumberPart) {
    if (!missingNumberPart) {

        return Promise.reject(new Error(`Found no missing phone number part for deal id ${dealId}, can not proceed.`));
    }
    return missingNumberPart;
}

function getNumberAndCache(dealId, cachedDeal, minfinParser) {
    return minfinParser.getMissingPhoneNumberPart(dealId)
        .then(missingNumberPart => validateMissingNumberPart(dealId, missingNumberPart))
        .then(missingNumberPart => {
            var indexOfRequired = cachedDeal.deals.findIndex(deal => parseInt(dealId) === deal.bidId),
                requiredDeal = cachedDeal.deals[indexOfRequired];

            var number = compileNumber(requiredDeal.hiddenNumber, missingNumberPart);

            requiredDeal.number = number;  //todo: to many different names for hiddenNumber/missingPart?
            cachedDeal.markModified(`deals.${indexOfRequired}.number`);
            cachedDeal.save();
            return he.decode(number); //todo: move formatting into separate place
        });
}

function compileNumber(partFromDeal, missingPart) {
    return partFromDeal.replace('xxx-x', missingPart);
}

export default class DealPhoneNumberProvider {

    constructor() {
        this.minfinParser = new MinfinParser();
    }

    /**
     * Returns promise which resolves to phone number for given deal id.
     *
     * @param dealId
     * @returns promise which resolves to phone number or rejected promise if it's not found.
     */
    getPhoneNumber(dealId) {
        log.verbose('', `Getting phone number for deal with id ${dealId}`);

        if (!dealId) {
            log.error('DealPhoneNumberProvider', 'Got empty deal id');
            return Promise.reject(new Error('No deal id provided'));
        }

        var dealIdNumber = parseInt(dealId);
        return CachedDeal.findOne({'deals' : {$elemMatch: {'bidId': dealIdNumber}}})
            .exec()
            .then(cachedDeal => validateCachedDeal(dealId, cachedDeal))
            .then(cachedDeal => {
                var requiredDeal = cachedDeal.deals.find(deal => dealIdNumber === deal.bidId);
                if (requiredDeal.number) {
                    return he.decode(requiredDeal.number);
                } else {
                    return getNumberAndCache(dealId, cachedDeal, this.minfinParser);
                }
            });
    }
}