import SetUp from './setUp'
import chai, {should} from 'chai';
import sinon from 'sinon';
import sinonMongoose from 'sinon-mongoose';
import sinonPromised from 'sinon-as-promised';

describe('SetUp command handler', function() {

    var setUpHandler,
        citySelector,
        currencySelector,
        operationSelector;

    beforeEach(function() {
        citySelector = getDummyHandler(),
            currencySelector = getDummyHandler(),
            operationSelector = getDummyHandler();
        setUpHandler = new SetUp(citySelector, currencySelector, operationSelector);
    });

    describe('Handle', function() {

        it('Should delegate handling to City Selector', function() {
            var mock = sinon.mock(citySelector).expects('handle').once();
            setUpHandler.handle();
            mock.verify();
        });
    });

    describe('handleCallbackQuery', function() {

        it('Should handle callback query with correct handler', function() {
            var currencySelectorMock = sinon.mock(currencySelector).expects('handleCallbackQuery').resolves({});
            setUpHandler.handleCallbackQuery({data: 'setup_currency_somedata'}); //todo: get from constants
            currencySelectorMock.verify();
        });

        it('Should delegate handling to next handler', function() {
            sinon.mock(currencySelector).expects('handleCallbackQuery').resolves({});
            var operationSelectorMock = sinon.mock(operationSelector).expects('handle').once();

            setUpHandler.handleCallbackQuery({data: 'setup_currency_somedata'}).then(() => { //todo: get from constants
                operationSelectorMock.verify();
            });
        });

        it('Should call no handler, if last handler was processed', function() {
            sinon.mock(operationSelector).expects('handleCallbackQuery').resolves({});

            var currencyMock = sinon.mock(currencySelector).expects('handle').never();
            var cityMock = sinon.mock(citySelector).expects('handle').never();
            var operationMock = sinon.mock(operationSelector).expects('handle').never();

            setUpHandler.handleCallbackQuery({data: 'setup_operation_somedata'}).then(() => {

                currencyMock.verify();
                cityMock.verify();
                operationMock.verify();
            }); //todo: get from constants
        });

        //todo: add checking of new Promise stuff and edge cases
    });

    function getDummyHandler() {
        return {
            handle: function() {},
            handleCallbackQuery: function() {}
        }
    }
});