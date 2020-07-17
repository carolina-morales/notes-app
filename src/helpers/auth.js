const helpers = {};

helpers.isAuthenticated = (req, res, next) => {
    // Passport tiene un metodo que determina si el usuario esta autenticado
    if (req.isAuthenticated()) {
        // Si esta autenticado, seguira con el codigo
        return next();
    }
    // Si no esta autenticado, mandara error y redirecciona
    req.flash('error_msg', 'Not authorized');
    res.redirect('/users/signin');
};

module.exports = helpers;