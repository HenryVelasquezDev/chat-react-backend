

class Sockets {

    constructor(io) {

        this.io = io;
        this.socketsEvents();

    }

    socketsEvents() {
        //"socket en el argumento hace referencia al cliente dispositivo que se esta conectando"
        this.io.on('connection', (socket) => {

            //emit() es una funcion del socket para emitir un evento
            // arg[0]: nombre del evento que se emite
            // arg[1]: payload o argumento que se va a enviar al cliente
            // socket.emit('mensaje-bienvenida',{
            //     msg: 'Bienvenido al server',
            //     fecha: new Date()
            // });

            //Escuchar el evento:  mensaje-cliente
            socket.on('mensaje-cliente', (data) => {
                console.log('mensaje del cliente');
                console.log(data);
            });

            //Escuchar el evento: mensaje-to-server
            socket.on('mensaje-to-server', (data) => {
                console.log('mensaje del cliente');
                console.log(data);

                //al usar socket solo emitimos el mensaje a ese cliente en particular
                // socket.emit('mensaje-from-server', data );

                //usamos io si queremos emitir el evento de forma global a todos los clientes
                this.io.emit('mensaje-from-server', data);

            });
        });
    }

}

module.exports = Sockets;