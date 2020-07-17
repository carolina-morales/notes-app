const User = require('../models/User');
const passport = require('passport');
const userCtrl = {}

userCtrl.renderSignUpForm = (req, res) => {
    res.render('users/signup');
};

userCtrl.signup = async (req, res) => {
    const errors = [];
    const { name, email, password, confirm_password } = req.body;
    // Validar contraseñas
    if (password !== confirm_password) errors.push({text: 'Passwords do not match.'});
    if (password.length < 4) errors.push({text: 'Password must be at least 4 characters.'});
    if (errors.length > 0) {
        // Enviar todos los errores al backend y datos del form para que no se reinicie
        res.render('users/signup', {
            errors,
            name,
            email,
            password,
            confirm_password
        });
    } else {
        // Buscar todos los usuarios con el mismo correo
        const emailUser = await User.findOne({email: email});
        // Validar si el correo ya es usado
        if (emailUser) {
            // Enviar mensaje de error por flash
            req.flash('error_msg', 'Email is already in used');
            // Redirigir al formulario de registro
            res.redirect('/users/signup');
        } else {
            // Crear un nuevo usuario basado en el schema
            const newUser = new User({name, email, password});
            // Cifrar la contraseña antes de almacenarla por motivos de seguridad
            newUser.password = await newUser.encryptPassword(password);
            // Almacenar el usuario
            await newUser.save();
            req.flash('success_msg', 'You are registered');
            // Redireccionar al form de login
            res.redirect('/users/signin');
        }
    }
};

userCtrl.renderSigninForm = (req, res) => {
    res.render('users/signin');
};

// Validara la autenticacion que se haya definido antes, en este caso, tomara en cuenta la funcion de LocalStrategy previa
userCtrl.signin = passport.authenticate('local', {
    failureRedirect: '/users/signin', // cuando todo vaya mal, se redirecciona al registro
    successRedirect: '/notes', // cuando todo vaya bien, se redirecciona a las notas
    failureFlash: true // cuando exista un error, se muestra usando flash
});

userCtrl.logout = (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out now');
    res.redirect('/users/signin');
};

module.exports = userCtrl;