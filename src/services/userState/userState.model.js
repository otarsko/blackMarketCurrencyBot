'use strict';

import _ from 'lodash';
import mongoose from 'mongoose';

var UserStateSchema = new mongoose.Schema({
    userId: String,
    operation: String,
    city: String,
    currency: String
});

UserStateSchema.statics.updateUserState = function(userId, updates) {
    return function(userState) {
        var updatedUserState;
        if (userState) {
            updatedUserState = _.merge(userState, updates);
        } else {
            updatedUserState = UserStateSchema.statics.createInstance(userId, updates.city, updates.operation, updates.currency);
        }
        return updatedUserState;
    }
};

UserStateSchema.statics.createInstance = function (userId, city, operation, currency) {
    var userState = new this();
    userState.userId = userId;
    userState.operation = operation;
    userState.city = city;
    userState.currency = currency;
    return userState;
};

export default mongoose.model('UserState', UserStateSchema);