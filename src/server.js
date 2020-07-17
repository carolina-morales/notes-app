const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const morgan = require('morgan');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

// Initializations
const app = express();
require('./config/passport');

// Settings
app.set('port', process.env.PORT || 4000); // detectar el puerto asignado o asignar uno por defecto
app.set('views', path.join(__dirname, 'views')); // determinar la vista por defecto de los layouts, independiente del SO
// Configurar el engine, es decir, el motor de plantillas, en este caso sera *.hbs
// Se determina el uso del modulo exphbs para configurar el handlebar
app.engine(
	'.hbs',
	exphbs({
		defaultLayout: 'main', // plantilla por defecto
		layoutsDir: path.join(app.get('views'), 'layouts'), // plantilla comun que siempre sera usada, se especifica la ruta
		partialsDir: path.join(app.get('views'), 'partials'), // importacion de partes de codigo html, se especifica la ruta
		extname: '.hbs' // configurar la extension que será usada
	})
);
// Asignar el motor de las vistas a una configuracion de variable
app.set('view engine', '.hbs');

// Middlewares
// Hacer que express reciba y envie datos JSON, es decir, que entienda los datos que llegan desde el HTML
app.use(
	express.urlencoded({
		extended: false
	})
);
// Ver el estado de las solicitudes HTTP de la ruta actual
app.use(morgan('dev'));
// Sobreescribir metodos HTTP, se configura para usar metodos PUT y DELETE
app.use(methodOverride('_method'));
// Modulo que ayudara a guardar los mensajes en el servidor, para luego ser usados | Flash se basa en este modulo
app.use(
	session({
		secret: 'secret',
		resave: true,
		saveUninitialized: true
	})
);
// Inicializar passport
app.use(passport.initialize());
app.use(passport.session());
// Usar los mensajes
app.use(flash());

// Global Variables
// Un middleware que establece las variables de flash como globales
app.use((req, res, next) => {
	// Obtener el valor de la variable de flash y almacenarla en la variable del servidor, para que toda la app la use
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	// Saber si el usuario fue autenticado o no
	res.locals.user = req.user || null;
	next();
});

// Routes
// Ruta por defecto
app.use(require('./routes/index.routes'));
app.use(require('./routes/notes.routes'));
app.use(require('./routes/users.routes'));

// Static Files
//
app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;
