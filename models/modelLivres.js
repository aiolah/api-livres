// ----- REQUÊTES (MODEL)

// Connexion à la bdd, localhost = 127.0.0.1
const nano = require('nano')('http://admin:6c6p8q@127.0.0.1:5984');
const dbLivres = nano.db.use("livres");

// Utilisation de JOI (pour la validation du format des données)
const Joi = require('joi')
.extend(require('@joi/date'));

// Récupération de tous les livres
async function getLivres()
{
    let query = {
        "selector": {},
        "fields": ["titre", "numero", "resume", "pages", "auteur", "date", "nombrePages", "isbn"]
    }

    let livres = await dbLivres.find(query);
    return livres.docs;
}

// Récupération d'un livre à partir de son numéro
async function getLivreByNumLivre(numlivre)
{
    let query = {
        "selector": {"numero": numlivre},
        "fields": ["titre", "numero", "resume", "pages", "auteur", "date", "nombrePages", "isbn"]
    }

    let livre = await dbLivres.find(query);
    // Si la requête renvoie autre chose qu'un tableau docs vide, soit si le tableau docs est rempli
    if(livre.docs.length != 0)
    {
        return livre.docs[0];
    }
    else
    {
        return 404;
    }
}

// Récupération d'un livre à partir de son numéro
async function getLivreByNumLivreId(numlivre)
{
    let query = {
        "selector": {"numero": numlivre},
        "fields": []
    }

    let livre = await dbLivres.find(query);
    // Si la requête renvoie autre chose qu'un tableau docs vide, soit si le tableau docs est rempli
    if(livre.docs.length != 0)
    {
        return livre.docs[0];
    }
    else
    {
        return 404;
    }
}

// Récupération des pages d'un livre
async function getPages(numlivre)
{
    let query = {
        "selector": {"numero": numlivre},
        "fields": []
    }

    let livre = await dbLivres.find(query);
    // Si la requête renvoie autre chose qu'un tableau docs vide, soit si le tableau docs est rempli
    if(livre.docs.length != 0)
    {
        if(livre.docs[0].pages.length != 0)
        {
            // On renvoie que les pages
            return livre.docs[0].pages;
        }
        else
        {
            return 404;
        }
    }
    else
    {
        return 404;
    }
}

// Récupérer une page d'après son numéro
async function getPage(numlivre, numpage)
{
    let query = {
        "selector": {"numero": numlivre},
        "fields": []
    }

    let livre = await dbLivres.find(query);
    // Si la requête renvoie autre chose qu'un tableau docs vide, soit si le tableau docs est rempli
    if(livre.docs.length != 0)
    {
        // Si le numéro de pages se trouve entre 0 et la longueur du tableau, soit s'il n'existe pas
        if(numpage <= 0 || numpage > livre.docs[0].pages.length)
        {
            return 404;
        }
        else
        {
            return livre.docs[0].pages[numpage - 1];
        }
    }
    else
    {
        return 404;
    }
}

// Ajout d'un livre
async function createBook(livre)
{
    let result = await dbLivres.insert(livre);
    return result;
}

// Modification d'un livre
async function modifyBook(livre, dataLivre)
{
    let newLivre = {
        "_id": livre._id,
        "_rev": livre._rev,
        "titre": dataLivre.titre,
        "numero": livre.numero,
        "resume": dataLivre.resume,
        "pages": dataLivre.pages,
        "auteur": dataLivre.auteur,
        "date": dataLivre.date,
        "nombrePages": dataLivre.nombrePages,
        "isbn": dataLivre.isbn
    }

    const { value, error } = schemaEdit.validate(newLivre);
    if(error == undefined)
    {
        let result = await dbLivres.insert(newLivre);
        if(result.ok == true)
        {
            return [true, "Résultat de la requête", "Livre modifié"];
        }
        else
        {
            return [false, "Erreur", "La requête d'insertion n'a pas fonctionné"];
        }
    }
    else
    {
        return[false, "Format non valide", error.details[0]["message"]];
    }
}

// Suppression d'un livre
async function deleteBook(livre)
{
    let result = await dbLivres.destroy(livre._id, livre._rev);
    return result;
}

module.exports = { getLivres, getLivreByNumLivre, getLivreByNumLivreId, getPages, getPage, createBook, modifyBook, deleteBook };

// Schéma de modification de livre
const schemaEdit = Joi.object({
    // Id
    _id: Joi.string()
        .required(),
    // Rev
    _rev: Joi.string()
        .required(),
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