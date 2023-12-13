// ----- INDEX.JS

const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const { routerLivres } = require("./routes/routerLivres.js");
app.use(routerLivres);

app.listen(8080);