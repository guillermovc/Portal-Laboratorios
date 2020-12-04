const express = require('express');
const router = express.Router();

const pool = require('../database');
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');

// Ruta para renderizar el formulario
router.get('/registro', isNotLoggedIn, (req, res) => {
    res.render('auth/registro', {title: 'Portal de Laboratorios - Registro', header: 'Registro de un usuario'});
});

// Ruta para recibir el formulario que envia la vista
router.post('/registro', isNotLoggedIn, passport.authenticate('local-signup', {
    successRedirect: '/principal',
    failureRedirect: '/registro',
    failureFlash: true
}));

router.get('/principal', isLoggedIn, async (req, res) => {
    const requests = await pool.query('SELECT * FROM requests');

    res.render('principal', {title: 'Portal de Laboratorios - Página Principal', 
                header: 'Página principal',
                requests});
});

router.post('/solicitud', isLoggedIn, async (req, res) => {
    console.log('body: ', req.body);
    var { datetimepicker } = req.body;
    console.log('fecha y hora: ', datetimepicker);

    const year = datetimepicker.substring(0, 4);
    const month = datetimepicker.substring(5, 7);
    const day = datetimepicker.substring(8,10);
    const hour = datetimepicker.substring(11, 13);
    const lab_code = 'CODIGO';
    const comments = 'Laboratorio solicitado por: ' + req.user.fullname;
    const user_id = req.user.id;
    const request_date = year + "-" + month + "-" + day + " " + hour + ":00:00";

    const newRequest = {
        user_id,
        request_date,
        lab_code,
        comments
    };

    console.log('solicitud: ', newRequest);
    const result = await pool.query("INSERT INTO requests SET ?", [newRequest]);
    const solicitudes = await pool.query("SELECT * FROM requests");
    console.log("Solicitudes: ", solicitudes);

    res.redirect("/principal");
});

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
    res.render('profile', {title: 'Portal de Laboratorios - Perfil de Usuario',header: 'Perfil de Usuario'});
});



router.get('/logout', isLoggedIn, (req, res) => {
    req.logOut();
    res.redirect('/signin');
});

router.get('/terminos', (req, res) => {
    res.render('auth/terminos', {title: 'Términos y condiciones - Portal de Laboratorios', header: 'Términos y condiciones'});
});

router.get('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params; // Obtiene el atributo id de params
    const users = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    console.log(users[0]);
    // const firstName = users[0].substring(0, indexOf(" "));
    res.render('links/edit', {title:'Modificar datos - Portal de Laboratorios', header: 'Modificar sus datos', user: users[0]});
});

router.post('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { alt_email, cellphone, diseases } = req.body;
    const newLink = {
         alt_email,
         cellphone,
         diseases
    };
    console.log(newLink);
    await pool.query('UPDATE users set ? WHERE id = ?', [newLink, id]);
    res.redirect('/profile')
});


module.exports = router;