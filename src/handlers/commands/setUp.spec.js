import SetUp from './setUp'
import chai, {should} from 'chai';
import sinon from 'sinon';

describe('SetUp command handler', function() {

    var setUpHandler,
        citySelector,
        currencySelector,
        operationSelector;

    beforeEach(function() {
        citySelector = getDummyHandler(),
            currencySelector = getDummyHandler(),
            operationSelector = getDummyHandler(),
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
            var mock = sinon.mock(currencySelector).expects('handleCallbackQuery').once();
            setUpHandler.handleCallbackQuery({data: 'setup_currency_somedata'}); //todo: get from constants
            mock.verify();
        });

        it('Should delegate handling to next handler', function() {
            var mock = sinon.mock(operationSelector).expects('handle').once();
            setUpHandler.handleCallbackQuery({data: 'setup_currency_somedata'}); //todo: get from constants
            mock.verify();
        });

        it('Should call no handler, if last handler was processed', function() {
            var currencyMock = sinon.mock(currencySelector).expects('handle').never();
            var cityMock = sinon.mock(citySelector).expects('handle').never();
            var operationMock = sinon.mock(operationSelector).expects('handle').never();

            setUpHandler.handleCallbackQuery({data: 'setup_operation_somedata'}); //todo: get from constants

            currencyMock.verify();
            cityMock.verify();
            operationMock.verify();
        });

        it('Should delegate handling to first handler if unknown name got', function() {
            var mock = sinon.mock(citySelector).expects('handle').once();
            setUpHandler.handleCallbackQuery({data: 'setup_ololohandleme_somedata'}); //todo: get from constants
            mock.verify();
        });
    });

    function getDummyHandler() {
        return {
            handle: function() {},
            handleCallbackQuery: function() {}
        }
    }
});