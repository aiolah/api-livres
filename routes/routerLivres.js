// ----- ROUTER

const controllerLivres = require("../controllers/controllerLivres.js");
const middlewareToken = require("../middlewares/middlewareToken.js");

const express = require("express");
const routerLivres = express.Router();

// Message d'accueil
routerLivres.get("/", controllerLivres.accueil);

// Message d'accueil
routerLivres.get("/createToken", controllerLivres.createToken);

// Liste des livres
routerLivres.get('/livres', controllerLivres.listeLivres);

// Le livre numéro :numlivre
routerLivres.get('/livres/:numlivre', controllerLivres.livre);

// Affichage de toutes les pages d'un livre
routerLivres.get('/livres/:numlivre/pages', controllerLivres.pages);

// Affichage d'une page d'un livre
routerLivres.get('/livres/:numlivre/pages/:numpage', controllerLivres.page);

// Ajout d'un nouveau livre
routerLivres.post('/livres', middlewareToken.verifJTW, controllerLivres.ajoutLivre);

// Modification d'un livre
routerLivres.put('/livres/:numlivre', middlewareToken.verifJTW, controllerLivres.modifierLivre);

// Suppression du livre :numlivre
routerLivres.delete('/livres/:numlivre', middlewareToken.verifJTW, controllerLivres.supprimerLivre);

module.exports = { routerLivres };