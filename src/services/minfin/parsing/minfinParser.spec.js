import MinfinParser from './minfinParser';
import Nock from 'nock';
import fs from 'fs';
import chai, {should} from 'chai';

should();

describe('Minfin Parser', () => {

    var minfinParser;

    function mockHttp(path, file) {
        new Nock("http://www.host.st")
            .get(path)
            .replyWithFile(200, file);
    }

    before(function() {
        minfinParser = new MinfinParser();
    });

    it('Should find all deals', (done) => {
        mockHttp('/wholePage', process.env.TEST_CONTENT + '/testHtml.html');
        minfinParser.getDeals("http://www.host.st/wholePage", (deals) => {
            deals.length.should.equal(3);
            done()
        });
    });

    it('Should extract deal details', (done) => {
        mockHttp('/simpleDeal', process.env.TEST_CONTENT + '/simpleDeal.html');
        minfinParser.getDeals("http://www.host.st/simpleDeal", (deals) => {
            deals.length.should.equal(1);
            var deal = deals[0];
            deal.getTime().should.equal("11:18");
            deal.getRate().should.equal("25,08");
            deal.getAmmount().should.equal("49 999 $");
            deal.getMessage().should.equal("Simple multiline message."); // remove line breaks.
            done()
        });
    });
});