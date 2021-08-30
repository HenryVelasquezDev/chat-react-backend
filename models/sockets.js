const { usuarioConectado, usuarioDesconectado, getUsuarios, grabarMensaje } = require("../controllers/sockets");
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

            if (!valido) {
                console.log('socket no identifocadp');
                return socket.disconnect();
            }

            await usuarioConectado(uid);

            //Unir al usuario a una sala  de socket.io
            socket.join( uid );

            //TODO: emitir todos los usuarios conectados
            this.io.emit('lista-usuarios', await getUsuarios());

            //TODO: escuchar cuando el cliente manda mensaje
            //mensaje-personal
            socket.on('mensaje-personal',async (payload) => {
                const mensaje = await grabarMensaje(payload);
                this.io.to( payload.para ).emit('mensaje-personal', mensaje);
                this.io.to( payload.de ).emit('mensaje-personal', mensaje);
            })

            //TODO: disconnect
            //MArcar en la bd que el usuario se desconecto
            //TODO: emitir todos los usuarios conetados
            socket.on('disconnect', async () => {
                await usuarioDesconectado(uid);
                this.io.emit('lista-usuarios', await getUsuarios());
            })

        });
    }

}

module.exports = Sockets;