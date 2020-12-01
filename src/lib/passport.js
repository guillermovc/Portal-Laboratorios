const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');
const helpers = require('../lib/helpers');

var LOCAL_STRATEGY_CONFIG = {
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
};

passport.use('local.signin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    console.log(req.body);
    const rows = await pool.query('SELECT * FROM users WHERE email = ?', [username]);
    if (rows.length > 0) {
        const user = rows[0];
        const validPassword = await helpers.matchPassword(password, user.password);
        if (validPassword) {
            done(null, user, req.flash('success', 'Bienvenido ' + user.fullname));
        } 
        else {
            done(null, false, req.flash('message', 'Contraseña incorrecta'));
        }
    }
    else {
        return done(null, false, req.flash('message', 'El nombre de usuario no existe'));
    }

}));

passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    const objeto_url = req.body;
    console.log('Objeto de la URL: ', objeto_url);
    const { 
        // email_inst,  Ya lo recibimos arriba
        alt_email,
        // password,    Ya lo recibimos arriba
        nombre,
        paterno,
        materno,
        a_nacimiento,
        m_nacimiento,
        d_nacimiento,
        genero,
        telefono,
        enf_ta
        } = req.body;
    const fullname = nombre + ' ' + paterno + ' ' + materno;
    const birthday = a_nacimiento + '-' + m_nacimiento + '-' + d_nacimiento;
    const email = username;
    const gender = genero;
    const cellphone = telefono;
    const diseases = enf_ta;
    const newUser = {
        email,
        alt_email,
        password,
        fullname,
        // a_nacimiento,
        // m_nacimiento,
        // d_nacimiento,
        birthday, 
        gender,
        cellphone,
        diseases
    };

    console.log(newUser);
    newUser.password = await helpers.encryptPassword(newUser.password);
    console.log('query');
    const result = await pool.query("INSERT INTO users SET ?", [newUser]);
    newUser.id = result.insertId;
    console.log('Todo salio bien');
    return done(null, newUser);
}));


// Guardar al usuario en una sesion
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const rows = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    done(null, rows[0]);
});