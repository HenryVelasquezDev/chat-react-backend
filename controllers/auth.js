const { response } = require("express");
const bcrypt = require("bcryptjs");
const Usuario = require('../models/usuario');
const { generarJWT } = require("../helpers/jwt");

const crearUsuario = async ( req, res = response) => {
    
    try {

        const { email, password } = req.body;

        const existeEmail = await Usuario.findOne({email});
        if (existeEmail){
            return res.status(400).json({
                ok:false,
                msg: 'El correo ya existe'
            });
        }

        const usuario = new Usuario( req.body );

        //encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        //Guardar en BD
        await usuario.save();

        //Generar JWT
        const token = await generarJWT( usuario.id );

        res.json({
            ok: true,
            usuario,
            token
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg: 'Hable con el administrador'
        });
    }

}

const login = async ( req, res = response ) => {

    const {email,password} = req.body;

    try {

        //Verificar si el correo existe
        const usuarioBD = await Usuario.findOne({email});
        if (!usuarioBD){
            return res.status(404).json({
                ok:false,
                msg: 'Email no encontrado'
            });
        }

        //Validar el password
        const validPassword = bcrypt.compareSync( password, usuarioBD.password);
        if(!validPassword){
            return res.status(404).json({
                ok:false,
                msg: 'Password incorrecto'
            })
        }

        //Generar JWT
        const token = await generarJWT( usuarioBD.id );

        res.json({
            ok:true,
            usuarioBD,
            token
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg: 'Hable con el administrador'
        });
    }

}

const renewToken = async ( req, res = response ) => {
    
    const uid = req.uid;

    //Generar un nuevo JWT
    const token = await generarJWT( uid );

    //Obtener el usuario por uid
    const usuario = await Usuario.findById( uid );


    res.json({
        ok:true,
        usuario,
        token
    })

}


module.exports= {
    crearUsuario,
    login,
    renewToken
}