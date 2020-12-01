const express = require('express');
const router = express.Router();

const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');

// Ruta para renderizar el formulario   
router.get('/registro', isNotLoggedIn, (req, res) => {
    res.render('auth/registro', {title: 'Portal de Laboratorios - Registro', header: 'Registro de un usuario'});
});

// Ruta para recibir el formulario que envia la vista
router.post('/registro', isNotLoggedIn, passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/registro',
    failureFlash: true
}));

router.get('/signin', isNotLoggedIn,(req, res) => {
    res.render('auth/signin');
});

router.post('/signin', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local.signin', {
        successRedirect: '/principal',
        failureRedirect: '/signin',
        failureFlash: true
    })(req, res, next);
});

router.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile');
});

router.get('/principal', isLoggedIn, (req, res) => {
    res.render('principal', {title: 'Portal de Laboratorios - Página Principal',header: 'Página principal'});
});

router.get('/logout', isLoggedIn, (req, res) => {
    req.logOut();
    res.redirect('/signin');
});

router.get('/terminos', (req, res) => {
    res.render('auth/terminos', {title: 'Términos y condiciones - Portal de Laboratorios', header: 'Términos y condiciones'});
});

module.exports = router;