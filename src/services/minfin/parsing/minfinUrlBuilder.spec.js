import MinfinUrlBuilder from './minfinUrlBuilder';
import UserState from '../../userState.model';
import chai, {should} from 'chai';

should();

describe('MinFin Url Builder', () => {
    var minfinUrlBuilder = new MinfinUrlBuilder();

    it('should return correct url for user buying $ in Kharkiv', () => {
        var url = minfinUrlBuilder.getUrl(new UserState("sell", "kharkiv", "usd"));
        url.should.equal('http://minfin.com.ua/currency/auction/usd/sell/kharkov');
    });

    it('should return undefined if incorrect currency is set', () => {
        var url = minfinUrlBuilder.getUrl(new UserState("sell", "kharkiv", "Galactic Credit"));
        (url === undefined).should.be.true
    });

    it('should return undefined if incorrect city is set', () => {
        var url = minfinUrlBuilder.getUrl(new UserState("sell", "Hyperion 9", "usd"));
        (url === undefined).should.be.true
    });

    it('should return undefined if incorrect operation is set', () => {
        var url = minfinUrlBuilder.getUrl(new UserState("Conquer the Galaxy", "kharkiv", "usd"));
        (url === undefined).should.be.true
    });
});