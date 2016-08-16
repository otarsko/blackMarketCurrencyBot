"use strict";
import _ from 'lodash';
import CommandException from '../../lib/commandException';
import UserState from '../../services/userState/userState.model';

const COMMAND_PREFIX = 'city_'; //todo: move to another place?

function getCitiesKeyboardOptions(callbackDataPrefix) { //todo: get from mongodb?
    return {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: 'Kharkiv', callback_data: callbackDataPrefix + 'kharkiv' }],
                [{ text: 'Kyiv', callback_data: callbackDataPrefix + 'kyiv' }]
            ]
        })
    };
}

function updateUserState(userId, city) {
    return function(userState) {
        var updatedUserState;
        if (userState) {
            updatedUserState = _.merge(userState, {'city': city});
        } else {
            updatedUserState = UserState.createInstance(userId, city);
        }
        return updatedUserState;
    }
}

export default class CitySelectorHandler {

    handle(message, bot, callbackDataPrefix) {
        return bot.sendMessage(message.from,
            'Please select the city you are interested in.',
            getCitiesKeyboardOptions(callbackDataPrefix + COMMAND_PREFIX));
    }

    handleCallbackQuery(message, bot) {
        console.log(message);
        var city = message.data.split('_')[1];

        return UserState.findOne({'userId': message.from}).exec()
            .then(updateUserState(message.from, city))
            .then(userState => {
                console.log('near to save', userState);
                return userState.save();
            })
            .then(() => {
                console.log('near to message');
                return bot.sendMessage(message.from, 'City has been set successfully.')
            })
            .catch((err) => {
                console.error('Got error on saving user status: ', err);
                return new CommandException(err.message);
            });
    };
}