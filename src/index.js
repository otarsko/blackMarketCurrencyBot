import log from 'npmlog';
import mongoose from 'mongoose';
import i18n from 'i18n';
import Promise from 'bluebird';
import Messenger from './lib/messenger';

const telegram = new Messenger();

mongoose.connect('mongodb://localhost/blackMarketBot'); //todo: move to configs
mongoose.connection.on('error', function(err) {
    console.error('MongoDB connection error: ' + err);
    process.exit(-1);
});

mongoose.Promise = Promise;

i18n.configure({
    locales:['en', 'ru', 'ukr'],
    directory: __dirname + '/i18n.files'
});

log.level = 'verbose';
telegram.listen().then(() => console.log('Listening'));
