const { usuarioConectado, usuarioDesconectado } = require("../controllers/sockets");
const { comprobarJWT } = require("../helpers/jwt");


class Sockets {

    constructor(io) {

        this.io = io;
        this.socketsEvents();

    }

    socketsEvents() {
        //"socket en el argumento hace referencia al cliente dispositivo que se esta conectando"
        this.io.on('connection', async (socket) => {
            
            const [valido, uid] = comprobarJWT(socket.handshake.query['x-token']);

            if( !valido ){
                console.log('socket no identifocadp');
                return socket.disconnect();
            }

            await usuarioConectado( uid );

           //TODO: Validar el JWT
           //Si token no valido desconectar


           //TODO: saber que usuario esta activo mediante el uid del token

           //TODO: emitir todos los usuarios conectados

           //TODO: Socket join, uid

           //TODO: escuchar cuando el cliente manda mensaje
           //mensaje-personal

           //TODO: disconnect
           //MArcar en la bd que el usuario se desconecto
           //TODO: emitir todos los usuarios conetados
           socket.on('disconnect', async () =>{
               await usuarioDesconectado( uid );
           })

        });
    }

}

module.exports = Sockets;