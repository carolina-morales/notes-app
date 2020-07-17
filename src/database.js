const mongoose = require('mongoose');

const { NOTES_APP_MONGODB_HOST, NOTES_APP_MONGODB_DATABASE } = process.env;
const MONGODB_URI = `mongodb://${NOTES_APP_MONGODB_HOST}/${NOTES_APP_MONGODB_DATABASE}`;

// const MONGODB_URI = `mongodb://localhost/notes-app`;

mongoose
	.connect(`mongodb://localhost/notes-app`, {
		useUnifiedTopology: true,
		useNewUrlParser: true,
		useCreateIndex: true
	})
	.then((db) => console.log('Base de datos conectada'))
	.catch((err) => console.log(err));
