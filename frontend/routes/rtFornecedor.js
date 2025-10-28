var express = require('express');
var fornecedoresApp = require("../apps/fornecedores/controller/ctlFornecedores");

var router = express.Router();

function authenticationMiddleware(req, res, next) {
    const isLogged = req.session.isLogged;
    if (!isLogged) {
        res.redirect("/Login");
        return;
    }
    next();
}

/* GET métodos */
router.get('/ManutFornecedores', authenticationMiddleware, fornecedoresApp.manutFornecedores);
router.get('/InsertFornecedores', authenticationMiddleware, fornecedoresApp.insertFornecedores);
router.get('/ViewFornecedores/:id', authenticationMiddleware, fornecedoresApp.ViewFornecedores);
router.get('/UpdateFornecedores/:id', authenticationMiddleware, fornecedoresApp.updateFornecedor);

/* POST métodos */
router.post('/InsertFornecedores', authenticationMiddleware, fornecedoresApp.insertFornecedores);
router.post('/UpdateFornecedores', authenticationMiddleware, fornecedoresApp.updateFornecedor);