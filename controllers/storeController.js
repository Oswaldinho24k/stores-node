const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter(req, file, next){
      const isPhoto = file.mimetype.startsWith('image/');
      if(isPhoto){
          next(null, true);
      }else{
          next({message:'no porno please!!'}, false);
      }
  }
};


exports.myMiddleware = (req, res, next) => {
    req.name = 'Oswaldinho';
    //if(req.name==='Oswaldinho'){
     //   throw Error('Pero que wapo')
    //}
    next();
};
exports.homePage = (req, res) => {
    console.log(req.name)
    res.render('index');
};

exports.addStore = (req, res) => {
    res.render('editStore', {title:'Add Store'})
};

exports.upload = multer(multerOptions).single('photo');

exports.resize = async (req, res, next)=>{
    if(!req.file){
        next();
        return;
    }
    const extension = req.file.mimetype.split('/')[1];
    req.body.photo = `${uuid.v4()}.${extension}`;

    const photo = await jimp.read(req.file.buffer);
    await photo.resize(800, jimp.AUTO);
    await photo.write(`./public/uploads/${req.body.photo}`);
    next();
};

exports.createStore = async (req, res) => {
    //query the db for all stores
  const store = await (new Store(req.body)).save();
  req.flash('success', `Succesfully created ${store.name}`);
  res.redirect(`/store/${store.slug}`);
};

exports.getStores = async (req, res) => {
    const stores = await Store.find();
    res.render('stores', {title:'Stores', stores})
};

exports.editStore = async (req, res) => {
    //find the store by id

    const store = await Store.findOne({_id:req.params.id});

    //confirm the owner
    // render out edit form
    res.render('editStore', {title:`edit Store ${store.name}`, store})

};


exports.updateStore = async (req, res) => {
    req.body.location.type = 'Point';
    const store = await Store.findOneAndUpdate({_id:req.params.id}, req.body, {
        new: true, 
        runValidators:true, 
    }).exec();
    req.flash('success', `Successfully updated store ${store.name}`);
    res.redirect(`/stores/${store._id}/edit`);
};

exports.getStoreBySlug = async(req, res, next)=>{

    const store = await Store.findOne({slug:req.params.slug});
    if(!store) return next();
    res.render('store', {store, title:store.name})
};