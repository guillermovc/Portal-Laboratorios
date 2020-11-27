const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars'); // Motor de plantillas
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const MySQLStore = require('express-mysql-session');
const passport = require('passport');
const bodyParser = require('body-parser');

const { database } = require('./keys');

// Initializations
const app = express(); // Inicializamos express en un objeto
require('./lib/passport');

// Settings
app.set('port', process.env.PORT || 4000);  // El puerto a utilizar
app.set('views', path.join(__dirname, 'views')); // Ruta para las vistas

// Configuramos el motor de rutas
app.engine('.hbs', exphbs({  // Utiliza el modulo expresshbs
    defaultLayout: 'main',  // El nombre de la plantilla principal en el dir layouts
    layoutsDir: path.join(app.get('views'), 'layouts'), // Para que sepa donde esta el dir layouts
    partialsDir: path.join(app.get('views'), 'partials'), // Almacena pedazos de codigo para reutilizar en las vistas
    extname: '.hbs', // Le decimos el nombre de la extension
    helpers: require('./lib/handlebars')  // Funciones utiles
}));
app.set('view engine', '.hbs');

// Middleware
// Para la sesión actual de un usuario
app.use(session({
    secret: 'faztmysqlnodesession',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
}));
app.use(flash());
app.use(morgan('dev')); // Para loggear en consola las peticiones
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.json());
app.use(passport.initialize());  // Le decimos que inicie, utiliza sesion
app.use(passport.session());

// Global Variables
app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    next();
});

// Routes
app.use(require('./routes/'));  // Toma el archivo index.js por default de la carpeta routes
app.use(require('./routes/authentication')); 
app.use('/solicitudes', require('./routes/links')); // que siempre le preceda links

// Public
app.use(express.static(path.join(__dirname, 'public')));

// Starting the server
app.listen(app.get('port'), () => {
    console.log('Server on port ', app.get('port'));
});