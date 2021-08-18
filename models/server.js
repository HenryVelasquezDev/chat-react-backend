//servidor de express
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const path = require('path');
const cors = require('cors');

const Sockets = require('./sockets');
const { dbConnection } = require('../database/config');

class Server {
    constructor() {

        this.app = express();
        this.port = process.env.PORT;

        //Conectar a DB
        dbConnection(); 

        //http server
        this.server = http.createServer(this.app);

        //configuraciones de sockets
        this.io = socketio(this.server, { /* configuraciones */ });
    }

    middlewares() {
        //Desplegar directorio publico
        this.app.use( express.static( path.resolve( __dirname, '../public' ) ) );//http://localhost:5050/

        //CORS
        this.app.use( cors() ) ;

        //PArseo del body
        this.app.use( express.json() );

        //API End Points
        this.app.use( '/api/login', require('../routers/auth'));
        this.app.use( '/api/mensajes', require('../routers/mensajes'))
    }

    configurarSockets() {
        new Sockets( this.io );
    }

    execute() {

        //inicializar middlewares
        this.middlewares();

        //Inicializar sockets
        this.configurarSockets();

        //inicializar server
        this.server.listen(this.port, () => {
            console.log('Server corriendo en puerto:', this.port)
        });

    }
}

module.exports = Server;