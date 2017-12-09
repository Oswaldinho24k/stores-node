const mongoose = require('mongoose');
const Store = mongoose.model('Store')


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
    const store = await Store.findOneAndUpdate({_id:req.params.id}, req.body, {
        new: true, 
        runValidators:true, 
    }).exec();
    req.flash('success', `Successfully updated store ${store.name}`);
    res.redirect(`/stores/${store._id}/edit`);
};