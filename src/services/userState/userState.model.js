'use strict';

import mongoose from 'mongoose';

var UserStateSchema = new mongoose.Schema({
    userId: String,
    operation: String,
    city: String,
    currency: String
});

UserStateSchema.statics.createInstance = function (userId, operation, city, currency) {
    var userState = new this();
    userState.userId = userId;
    userState.operation = operation;
    userState.city = city;
    userState.currency = currency;
    return userState;
};

export default mongoose.model('UserState', UserStateSchema);