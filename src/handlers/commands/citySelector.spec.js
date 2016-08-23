import chai, {should} from 'chai';
import sinon from 'sinon';
import sinonMongoose from 'sinon-mongoose';
import sinonPromised from 'sinon-as-promised';

import CitySelectorHandler from './citySelector'
import Message from '../../lib/message'
import UserState from '../../services/userState/userState.model'
import CommandException from '../../lib/commandException'

//todo: think about how to improve these tests (how to validate json in correct way)
describe('CitySelectorHandler', function() {

    var citySelectorHandler = new CitySelectorHandler();

    describe('handle', function() {

        var message = new Message('user', 'text');

        it('Should return sendMessage execution result', function() {
            var result = citySelectorHandler.handle(message, mockBot(), 'somePrefix');
            result.should.equal('value');
        });

        it('Should send message to correct user', function() {
            var bot = mockBot();
            citySelectorHandler.handle(message, bot, 'somePrefix');
            bot.userId.should.equal('user');
        });

        it('Should append callback data prefix with command prefix', function() {
            var bot = mockBot();
            citySelectorHandler.handle(message, bot, 'somePrefix_');
            bot.options.reply_markup.should.contain('somePrefix_city_kharkiv');
        });

        it('Should return 2 cities for inline keyboard', function() {
            var bot = mockBot();
            citySelectorHandler.handle(message, bot, 'somePrefix_');
            var inlineKeyboardArray = JSON.parse(bot.options.reply_markup).inline_keyboard;
            [].concat.apply([], inlineKeyboardArray).length.should.equal(2);
        })
    });

    describe('handleCallbackQuery', function() {

        const ERROR_MESSAGE = 'error message';

        var modelMock,
            userStateInstance,
            newUserStateInstance,
            userStateMock,
            newUserStateMock;

        //todo: check if I can mock everything there and if I do not have errors
        //when I mock everything there, call verify and get error about timeout instead of
        //not met expectations
        beforeEach(function() {
            modelMock = sinon.mock(UserState);

            userStateInstance = UserState.createInstance('userId', 'city');
            newUserStateInstance = UserState.createInstance('userId2', 'city2');
            userStateMock = sinon.mock(userStateInstance);
            newUserStateMock = sinon.mock(newUserStateInstance);
        });

        it('Should update existing model and save it', function(done) {

            modelMock.expects('findOne').withArgs({userId: 'existingUserId'})
                .chain('exec')
                .resolves(userStateInstance);
            userStateMock.expects('save').resolves('save_promise');
            var message = {
                data: 'prefix_cityName',
                from: 'existingUserId'
            };

            citySelectorHandler.handleCallbackQuery(message, mockBot())
                .then(function() {
                    modelMock.verify();
                    userStateMock.verify();
                    done();
            });
        });

        it('Should catch error on user state saving and return custom', function(done) {
            modelMock.expects('findOne').withArgs({userId: 'exceptionUserId'})
                .chain('exec')
                .resolves(userStateInstance);
            userStateMock.expects('save')
                .rejects(new Error(ERROR_MESSAGE));
            var message = {
                data: 'prefix_cityName',
                from: 'exceptionUserId'
            };

            citySelectorHandler.handleCallbackQuery(message, mockBot())
                .then(function(data) {

                    modelMock.verify();
                    userStateMock.verify();

                    data.should.be.instanceof(CommandException);
                    data.message.should.equal(ERROR_MESSAGE);
                    done();
            });

        });

        //todo: too many mocks. Prefer stubs?
        //todo: this should userState.model
        //it('Should create and save new user state if not found existing', function(done) {
        //    modelMock.expects('findOne').withArgs({userId: 'notExistingUserId'})
        //        .chain('exec')
        //        .resolves(null);
        //
        //    newUserStateMock.expects('save')
        //        .resolves('some_result');
        //
        //    var message = {
        //        data: 'prefix_city2',
        //        from: 'notExistingUserId'
        //    };
        //
        //    modelMock.expects('createInstance')
        //        .withArgs('notExistingUserId', 'city2')
        //        .returns(newUserStateInstance);
        //
        //    citySelectorHandler.handleCallbackQuery(message, mockBot())
        //        .then(function(data) {
        //
        //            modelMock.verify();
        //            newUserStateMock.verify();
        //
        //            done();
        //        });
        //})
    });

    function mockBot() {
        return  {
            sendMessage: function(userId, message, options){
                this.userId = userId;
                this.message = message;
                this.options = options;
                return 'value';
            }
        };
    }
});
