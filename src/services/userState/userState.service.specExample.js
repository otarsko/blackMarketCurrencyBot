import UserStateService from './userState.service'
import UserState from './userState.model'
import chai, {should} from 'chai';
import sinon from 'sinon';
import sinonMongoose from 'sinon-mongoose';
import sinonPromised from 'sinon-as-promised';

describe('User State Service', function() {

    var userStateService,
        modelMock;

    before(function() {
        userStateService = new UserStateService();
        modelMock = sinon.mock(UserState);
    });

    describe('Get user state', function() {

        before(function() {
            userStateService = new UserStateService();
            modelMock = sinon.mock(UserState);

            modelMock.expects('findById').withArgs('some_user_id')
                .chain('exec')
                .resolves(UserState.createInstance('userId', 'op'));

            modelMock.expects('findById').withArgs('some_exception_user_id')
                .chain('exec')
                .rejects(new Error('test error'));
        });

        it('Should call callback on found user state', function(done) {

            userStateService.getUserState("some_user_id", function(result) {
                (result === undefined).should.not.be.true;
                result.operation.should.equal("op");
                done();
            });
        });

        it('Should call callback in case of error', function(done) {

            userStateService.getUserState("some_exception_user_id", function(result) {
                (result === undefined).should.not.be.true;
                (result instanceof Error).should.be.true;
                done();
            });
        })
    });

    describe('Save user state', function() {

        var userState = UserState.createInstance('userId', 'op');
        var savedState = UserState.createInstance('userId', 'op');

        var errorUserState = UserState.createInstance('error_id', 'op');

        before(function() {
            modelMock.expects('create').withArgs(userState)
                .resolves(savedState);

            modelMock.expects('create').withArgs(errorUserState)
                .rejects(new Error('test error'));
        });

        it('Should call callback with newly created and saved model', function(done) {
            userStateService.saveUserState(userState, function(result) {
                (result === undefined).should.not.be.true;
                result._id.should.not.equal(userState._id);
                done();
            });
        });

        it('Should call callback in case of error', function(done) {

            userStateService.saveUserState(errorUserState, function(result) {
                (result === undefined).should.not.be.true;
                (result instanceof Error).should.be.true;
                done();
            });
        });
    });
});