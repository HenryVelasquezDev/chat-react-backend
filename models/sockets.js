

class Sockets {

    constructor(io) {

        this.io = io;
        this.socketsEvents();

    }

    socketsEvents() {
        //"socket en el argumento hace referencia al cliente dispositivo que se esta conectando"
        this.io.on('connection', (socket) => {

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

        });
    }

}

module.exports = Sockets;