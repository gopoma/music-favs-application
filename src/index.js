const path = require("path");
const express = require("express");
const morgan = require("morgan");
const session = require("express-session");

// Importando las Variables de Entorno
const {port, sessionSecret} = require("./config");
// Importando los Custom Middlewares
const addSessionToTemplate = require("./middleware/addSessionToTemplate");
// Importando las Rutas
const auth = require("./routes/auth");

const app = express();

// Usando registros con morgan
app.use(morgan("dev"));
// Configurando Archivos Estáticos
app.use(express.static(path.join(__dirname, "static")));
app.use(express.urlencoded({extended:true}));

// Configurando Template Engine
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
// Configurando la Sesión
app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
}));

// Utilizando Custom Middlewares
app.use(addSessionToTemplate);
// Utilizando Rutas
auth(app);

app.get("/", (req, res) => {
  return res.render("home");
});
app.get("/notAllowed", (req, res) => {
  return res.render("notAllowed");
});
app.all("*", (req, res) => {
  return res.render("notFound");
})

app.listen(port, () => {
  console.log(`Listening on: http://localhost:${port}`);
});