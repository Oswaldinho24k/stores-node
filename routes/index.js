const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');

// Do work here
//router.get('/', storeController.myMiddleware, storeController.homePage)

const {catchErrors} = require('../handlers/errorHandlers');

//router.get('/', storeController.homePage);
router.get('/', catchErrors(storeController.getStores));
router.get('/stores', catchErrors(storeController.getStores));
router.get('/add', storeController.addStore);
router.post('/add', catchErrors(storeController.createStore));
router.post('/add/:id', catchErrors(storeController.updateStore));
router.get('/stores/:id/edit', catchErrors(storeController.editStore));


module.exports = router;