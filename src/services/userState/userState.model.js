'use strict';

import _ from 'lodash';
import mongoose from 'mongoose';

var UserStateSchema = new mongoose.Schema({
    userId: String,
    operation: String,
    city: String,
    currency: String
});

//todo: fix issue with 'TypeError: this is not a constructor'. Bind instead of call?
UserStateSchema.statics.updateUserState = function(userId, updates) {
    var self = this;
    return function(userState) {
        var updatedUserState;
        if (userState) {
            updatedUserState = _.merge(userState, updates);
        } else {
            updatedUserState = UserStateSchema.statics.createInstance.call(self, userId, updates.city, updates.operation, updates.currency);
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