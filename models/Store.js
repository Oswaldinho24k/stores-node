const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slug');

const storeSchema = new mongoose.Schema({
    name: {
        type:String,
        trim: true,
        required: 'Please enter a Store Name'
    },
    store :String,
    description:{
        type:String,
        tream:true
    },
    tags: [String]
});


storeSchema.pre('save', function(next){
    if(!this.isModified('name')){
        next();
        return;
    }
    this.slug = slug(this.name);
    next();
});

module.exports = mongoose.model('Store', storeSchema);
