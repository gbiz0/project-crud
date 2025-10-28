var express = require('express');
var router = express.Router();
var contasApp = require("../apps/contas/controller/ctlContas")

function authenticationMiddleware(req, res, next) {
    const isLogged = req.session.isLogged;    
  
    if (!isLogged) {      
      return res.redirect("/Login");
    }
    next();
}; 
  
/* GET métodos */
router.get('/ManutContas', authenticationMiddleware, contasApp.manutContas)
router.get('/InsertContas', authenticationMiddleware, contasApp.insertContas);
router.get('/ViewContas/:id', authenticationMiddleware, contasApp.ViewContas);
router.get('/UpdateContas/:id', authenticationMiddleware, contasApp.updateConta);

/* POST métodos */
router.post('/InsertContas', authenticationMiddleware, contasApp.insertContas);
router.post('/UpdateContas', authenticationMiddleware, contasApp.updateConta);
router.post('/DeleteContas', authenticationMiddleware, contasApp.deleteConta);

module.exports = router;