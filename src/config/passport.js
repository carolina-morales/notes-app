const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/User');

// Middleware de passport
// Se define una nueva estrategia para autenticar
passport.use(new LocalStrategy({
    // Se especifican los parametros que se deben enviar (email y password)
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    // Cuando se reciban los datos se ejecutara esta funcion
    // Recibe la data y al final un callback llamado done
    // Aqui se validan los datos y consultar a la base de datos
    
    // Buscar que el correo coincida
    const user = await User.findOne({email});
    if (!user) {
        // Si no existe el usuario, finalizar el metodo y enviar mensaje de error
        return done(null, false, { message: 'Not user found' });
    } else {
        // Validar la contraseña del formulario con la encriptada
        const match = await user.matchPassword(password);
        if (match) {
            // La contraseña es correcta, por lo que se envia la data del user
            // Le dira a password que finalice pues se encontro la coincidencia
            // Guardara la informacion en la sesion del servidor y por cada navegacion comprobara si el usuario tiene autorizacion o no
            return done(null, user);
        } else {
            // La contrase es incorrecta y se envia mensaje de error
            return done(null, false, { message: 'Incorrect Password' });
        }
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (error, user) => {
        done(error, user);
    });
});