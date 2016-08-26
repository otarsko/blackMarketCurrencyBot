import MinfinUrlBuilder from './minfinUrlBuilder';
import UserState from '../../../userState/userState.model';
import chai, {should} from 'chai';

should();

describe('MinFin Url Builder', () => {
    var minfinUrlBuilder = new MinfinUrlBuilder();

    it('should return correct url for user buying $ in Kharkiv', () => {
        var url = minfinUrlBuilder.getUrl(UserState.createInstance('user1', 'kharkiv', 'sell', 'usd'));
        url.should.equal('http://minfin.com.ua/currency/auction/usd/sell/kharkov');
    });

    it('should return undefined if incorrect currency is set', () => {
        var url = minfinUrlBuilder.getUrl(UserState.createInstance('user1', 'kharkiv', 'sell', 'Galactic Credit'));
        (url === undefined).should.be.true;
    });

    it('should return undefined if incorrect city is set', () => {
        var url = minfinUrlBuilder.getUrl(UserState.createInstance('user1', 'Hyperion 9', 'sell', 'usd'));
        (url === undefined).should.be.true;
    });

    it('should return undefined if incorrect operation is set', () => {
        var url = minfinUrlBuilder.getUrl(UserState.createInstance('user1', 'kharkiv', 'Conquer the Galaxy', 'usd'));
        (url === undefined).should.be.true;
    });
});