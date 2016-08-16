import mongoose from 'mongoose';
import Promise from 'bluebird';
import Messenger from './lib/messenger';

const telegram = new Messenger();

mongoose.connect('mongodb://localhost/blackMargetBot'); //todo: move to configs
mongoose.connection.on('error', function(err) {
    console.error('MongoDB connection error: ' + err);
    process.exit(-1);
});

mongoose.Promise = Promise;

telegram.listen().then(() => { console.log('Listening'); });
