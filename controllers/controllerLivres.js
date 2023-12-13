// ----- CONTROLLER

const modelLivres = require("../models/modelLivres.js");

// Utilisation de JOI (pour la validation du format des données)
const Joi = require('joi')
.extend(require('@joi/date'));

let jwt = require("jsonwebtoken");

// Message d'accueil
function accueil(req, res)
{
    res.json({ "Message d'accueil": "API de gestion des livres" });
}

function createToken(req, res)
{
    let token = jwt.sign({ name: req.query.user }, 'maclesecrete', { expiresIn: '24h'});
    res.json({ "jeton": token});
}

// Liste des livres
async function listeLivres(req, res)
{
    let livres = await modelLivres.getLivres();
    res.json(livres);
}

// Le livre numéro :numlivre
async function livre(req, res)
{
    let livre = await modelLivres.getLivreByNumLivre(req.params.numlivre);
    if(livre != 404)
    {
        res.json(livre);
    }
    else
    {
        res.status(404).json({ "Erreur": "Livre non trouvé" });
    }
}

// Affichage de toutes les pages d'un livre
async function pages(req, res)
{
   let livre = await modelLivres.getLivreByNumLivre(req.params.numlivre);
   if(livre != 404)
    {
        let pages = await modelLivres.getPages(req.params.numlivre);
        if(pages != 404)
        {
            res.json(pages);
        }
        else
        {
            res.status(404).json({ "Erreur": "Le livre ne contient pas de pages" });
        }
    }
   else
   {
       res.status(404).json({ "Erreur": "Livre non trouvé" });
   }
}

// Affichage d'une page d'un livre
async function page(req, res)
{
    let livre = await modelLivres.getLivreByNumLivre(req.params.numlivre);
    if(livre != 404)
    { 
        let page = await modelLivres.getPage(req.params.numlivre, req.params.numpage);
        if(page != 404)
        {
            res.json(page);
        }
        else
        {
            res.status(404).json({ "Erreur": "Page non trouvée" });
        }
    }
    else
    {
        res.status(404).json({ "Erreur": "Livre non trouvé" });
    }
}

// Ajout d'un nouveau livre
async function ajoutLivre(req, res)
{
    let livre = req.body;

    const { value, error } = schemaAjout.validate(livre);
    if(error == undefined)
    {
        let result = await modelLivres.createBook(req.body);
        if(result.ok == true)
        {
            res.json({ "Résultat de la requête": "Livre ajouté" });
        }
        else
        {
            res.status(404).json({ "Erreur": "La requête de création n'a pas fonctionné" });
        }
    }
    else
    {
        res.status(404).json({ "Format non valide": error.details[0]["message"] });
    }
}

// Modification d'un livre
async function modifierLivre(req, res)
{
    let numlivre = req.params.numlivre;
    let dataLivre = req.body;

    let livre = await modelLivres.getLivreByNumLivreId(numlivre);
    if(livre != 404)
    {
        let [result, propriete, message] = await modelLivres.modifyBook(livre, dataLivre);
        if(result)
        {
            res.json({ [propriete]: message });
        }
        else
        {
            res.status(404).json({ [propriete]: message });
        }
    }
}

// Suppression du livre :numlivre
async function supprimerLivre(req, res)
{
    let numlivre = req.params.numlivre;

    let livre = await modelLivres.getLivreByNumLivreId(numlivre);
    if(livre != 404)
    {
        let result = await modelLivres.deleteBook(livre);
        if(result.ok == true)
        {
            res.json({ "Résultat de la requête": "Livre supprimé !" });
        }
        else
        {
            res.status(404).json({ "Erreur": "La requête de suppression n'a pas fonctionné" });
        }
    }
    else
    {
        res.status(404).json({ "Erreur": "Livre non trouvé" });
    }
}

// Schéma d'ajout d'un livre
const schemaAjout = Joi.object({
    // Titre
    titre: Joi.string()
        .required(),
    // Numéro
    numero: Joi.string()
        .alphanum()
        .required(),
    // Résumé
    resume: Joi.string()
        .min(3)
        .max(30)
        .required(),
    // Pages
    pages: Joi.array()
        .items(Joi.string())
        .required(),
    // Auteur
    auteur: Joi.string()
        .min(3)
        .max(30)
        .required(),
    // Date
    date: Joi.date()
        .format("DD/MM/YYYY")
        .required(),
    // Nombre pages
    nombrePages: Joi.number()
        .required(),
    // ISBN
    isbn: Joi.number()
        .required()
});

module.exports = { accueil, createToken, listeLivres, livre, pages, page, ajoutLivre, modifierLivre, supprimerLivre };