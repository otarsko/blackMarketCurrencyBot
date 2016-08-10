import UserState from './userState.model'

function handleError(userId, callback) {
    return function(err) {
        console.error('Can not get state of user: ' + userId + '. Error is: ' + err);
        callback(err);
    };
}

export default class UserStateService {

    constructor() {}

    getUserState(userId, callback) {
        return UserState.findById(userId).exec()
            .then(callback)
            .catch(handleError(userId, callback));
    }

    saveUserState(userState, callback) {
        UserState.create(userState)
            .then(callback)
            .catch(handleError(userState.userId, callback));
    }
}