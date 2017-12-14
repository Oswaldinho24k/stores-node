const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slug');

const storeSchema = new mongoose.Schema({
    name: {
        type:String,
        trim: true,
        required: 'Please enter a Store Name'
    },
    slug :String,
    description:{
        type:String,
        tream:true
    },
    tags: [String],
    created:{
        type:Date,
        default: Date.now
    },
    location:{
        type:{
            type:String,
            default:'Point'
        },
        coordinates:[{
                type:Number,
                required:'please dame tu pinche ubicacion'
            }],
        address:{
            type:'String',
            required:'agora tu dirección'
        }
    },
    photo:String
});


storeSchema.pre('save', async function(next){
    if(!this.isModified('name')){
        next();
        return;
    }

    this.slug = slug(this.name);
    //find others that named the same
    const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`,'i');

    const storeWithSlug = await this.constructor.find({slug:slugRegEx});

    if(storeWithSlug.length){
        this.slug = `${this.slug}-${storeWithSlug.length + 1}`;
    }
    next();
});

module.exports = mongoose.model('Store', storeSchema);
