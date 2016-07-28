import MinfinUrlBuilder from './minfinUrlBuilder';
import chai, {should} from 'chai';
should();

describe('pad', () => {
    it('should pad a string', () => {
        assert.equal(pad('foo', 4), '0foo');
    });
});