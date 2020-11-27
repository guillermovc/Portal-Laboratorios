module.exports = {

    isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        
        return res.redirect('/signin');
    },

    // Rutas que queiras evitar cuando el usuario este logeado
    isNotLoggedIn(req, res, next) {
        if (!req.isAuthenticated()) {
            return next();
        }
        
        return res.redirect('/profile');
    }
}