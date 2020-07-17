// Sirve para guardar variables de entorno y no tener informacion sensible a la vista
require('dotenv').config();

const app = require('./server');
require('./database');

app.listen(app.get('port'), () => {
	console.log('Servidor en el puerto:', app.get('port'));
});
