'use strict';

import mongoose from 'mongoose';

var CachedDealSchema = new mongoose.Schema({
    url: String,
    deals: [{type: mongoose.Schema.Types.Mixed  }]
}, {timestamps: true});

export default mongoose.model('CachedDeal', CachedDealSchema);